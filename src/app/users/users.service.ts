import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client/ldri/index.js';
import * as bcrypt from 'bcrypt';
import { MailQueueProducer } from '../queue/queue.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailQueueProducer,
  ) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    // hash the password before saving
    const salt = bcrypt.genSaltSync(5);

    let passwordHash = '';
    if (
      createUserDto.password !== undefined ||
      createUserDto.password !== null
    ) {
      passwordHash = bcrypt.hashSync(createUserDto.password, salt);
    }
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: passwordHash },
        omit: {
          password: true,
        },
      });
      // Send email to admin to validate the user.
      this.mailer.sendMail({
        from: '"LDRI Collect Backend" <serveys@stateofdata.org>',
        to: process.env.ADMIN_EMAIL,
        subject: 'New User Registration - Validation Required',
        text: `A new user has registered with the email: ${user.email}. Please review and validate the account.`,
      });
      // Send email to user that their account is pending validation.
      this.mailer.sendMail({
        from: '"LDRI Collect" <serveys@stateofdata.org>',
        to: user.email,
        subject: 'Registration Successful - Pending Validation',
        text: `Hello ${user.name}, thank you for registering. Your account is pending validation by an administrator. You will receive another email once your account has been validated.`,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user.');
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        _count: true,
      },
      omit: {
        password: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  findAllPending() {
    return this.prisma.user.findMany({
      include: {
        _count: true,
      },
      omit: {
        password: true,
      },
      orderBy: { id: 'desc' },
      where: { valid: false },
    });
  }

  findOne(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email },
      include: {
        _count: true,
      },
    });
  }

  findOneById(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
      include: {
        Delegates: true,
        FormSubmissions: true,
        _count: true,
      },
    });
  }

  async getDelegates(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        Delegates: {
          include: { form: true },
        },
      },
    });
    if (user === null) {
      throw new UnauthorizedException('User not found');
    }
    return user.Delegates;
  }

  async getForms(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        FormSubmissions: {
          include: {
            delegate: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
    if (user === null) {
      throw new UnauthorizedException('User not found');
    }

    // Transform forms to include sections data for frontend
    const forms = user.FormSubmissions.map((form) => {
      if (!form.totalScore) {
        return {
          ...form,
          sections: [],
          totalScore: 0,
          maxScore: 0,
        };
      }

      const sections = [
        { name: 'Section 1', score: form.section1Score },
        { name: 'Section 2', score: form.section2Score },
        { name: 'Section 3', score: form.section3Score },
        { name: 'Section 4', score: form.section4Score },
        { name: 'Section 5', score: form.section5Score },
      ];

      return {
        ...form,
        sections,
        totalScore: form.totalScore,
        maxScore: 100, // Adjust to your scoring scale
      };
    });

    return forms;
  }

  async getUserDashboardData(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        Delegates: {
          select: {
            name: true,
            email: true,
            department: true,
            formSubmissionCode: true,
            county: true,
            form: {
              select: {
                id: true,
                completed: true,
              },
            },
          },
        },
        _count: {
          select: {
            Delegates: true,
            FormSubmissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const totalDelegates = user._count.Delegates ?? 0;
    const completedForms = (user.Delegates || []).filter(
      (d) => d.form?.completed === true,
    ).length;

    const delegates = (user.Delegates || []).map((d) => ({
      name: d.name,
      email: d.email,
      department: d.department,
      formSubmissionCode: d.formSubmissionCode,
      hasSubmitted: d.form?.completed === true,
      formId: d.form?.id ?? null,
    }));

    return {
      expectedDelegates: totalDelegates,
      completedForms,
      delegates,
      _count: user._count,
    };
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async validateUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
          valid: false, // Only update if the user is not already valid
        },
        data: {
          valid: true,
        },
      });
      // Send Email
      this.mailer.sendMail({
        from: '"LDRI Collect" <serveys@stateofdata.org>',
        to: user.email,
        subject: 'Account Successfully Validated',
        text: `Hello ${user.name}, your account has been successfully validated. You can now log in to the LDRI Collect application.`,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error validating user with ID ${id}`,
      );
    }
  }

  async isValidUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user !== null && user.valid;
  }
}
