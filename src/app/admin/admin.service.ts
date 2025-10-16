import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: Prisma.AdminCreateInput) {
    // Basic validation
    if (!createAdminDto.email || createAdminDto.email.trim() === '') {
      throw new Error('Email is required');
    }
    if (!createAdminDto.password || createAdminDto.password.trim() === '') {
      throw new Error('Password is required');
    }

    // hash the password before saving
    const salt = bcrypt.genSaltSync(5);

    let passwordHash = '';
    if (
      createAdminDto.password !== undefined &&
      createAdminDto.password !== null
    ) {
      passwordHash = bcrypt.hashSync(createAdminDto.password, salt);
    }
    return this.prisma.admin.create({
      data: { ...createAdminDto, password: passwordHash },
    });
  }

  findAll() {
    return this.prisma.admin.findMany();
  }

  findOne(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  findOneById(id: number) {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  async getDashboardStats() {
    const [
      totalUsers,
      pendingValidations,
      totalDelegates,
      totalForms,
      completedForms,
      avgScores,
      formsByCounty,
    ] = await Promise.all([
      // Total users count
      this.prisma.user.count(),

      // Pending validations (users where valid = false)
      this.prisma.user.count({
        where: { valid: false },
      }),

      // Total delegates count
      this.prisma.delegate.count(),

      // Total form submissions count
      this.prisma.form.count(),

      // Completed forms count
      this.prisma.form.count({
        where: { completed: true },
      }),

      // Average scores across all forms
      this.prisma.form.aggregate({
        _avg: {
          totalScore: true,
          section1Score: true,
          section2Score: true,
          section3Score: true,
          section4Score: true,
          section5Score: true,
        },
      }),

      // Forms grouped by county
      this.prisma.form.groupBy({
        by: ['userId'],
        _count: true,
      }),
    ]);

    // Get county distribution by joining with users
    const countyDistribution = await this.getFormsByCounty();

    const completionRate =
      totalForms > 0 ? (completedForms / totalForms) * 100 : 0;

    return {
      totalUsers,
      pendingValidations,
      totalDelegates,
      totalForms,
      completedForms,
      completionRate: Math.round(completionRate * 10) / 10,
      averageScores: {
        total: Math.round((avgScores._avg.totalScore || 0) * 10) / 10,
        section1: Math.round((avgScores._avg.section1Score || 0) * 10) / 10,
        section2: Math.round((avgScores._avg.section2Score || 0) * 10) / 10,
        section3: Math.round((avgScores._avg.section3Score || 0) * 10) / 10,
        section4: Math.round((avgScores._avg.section4Score || 0) * 10) / 10,
        section5: Math.round((avgScores._avg.section5Score || 0) * 10) / 10,
      },
      countyDistribution,
    };
  }

  /**
   * Get forms distribution by county
   */
  async getFormsByCounty() {
    const forms = await this.prisma.form.findMany({
      where: {
        userId: { not: null },
      },
      include: {
        User: {
          select: {
            county: true,
          },
        },
      },
    });

    const countyMap = new Map<string, number>();

    forms.forEach((form) => {
      if (form.User) {
        const county = form.User.county;
        countyMap.set(county, (countyMap.get(county) || 0) + 1);
      }
    });

    return Array.from(countyMap.entries()).map(([county, count]) => ({
      county,
      count,
    }));
  }

  async isAdmin(idOrEmail: number | string): Promise<boolean> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: typeof idOrEmail === 'number' ? idOrEmail : undefined,
        email: typeof idOrEmail === 'string' ? idOrEmail : undefined,
      },
    });
    return admin !== null;
  }
}
