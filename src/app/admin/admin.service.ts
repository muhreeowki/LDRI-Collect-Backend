import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma.service';
import { Admin, Prisma } from '@prisma/client/ldri/index.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: Prisma.AdminCreateInput) {
    // hash the password before saving
    const salt = bcrypt.genSaltSync(5);
    console.log('salt:', salt);
    console.log('createUserDto:', createAdminDto);

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

  // TODO: Test this
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
