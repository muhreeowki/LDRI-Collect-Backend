import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Delegate, Form, Prisma, User } from '@prisma/client/ldri/index.js';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    // hash the password before saving
    const salt = bcrypt.genSaltSync(5);
    console.log('salt:', salt);
    console.log('createUserDto:', createUserDto);

    let passwordHash = '';
    if (
      createUserDto.password !== undefined ||
      createUserDto.password !== null
    ) {
      passwordHash = bcrypt.hashSync(createUserDto.password, salt);
    }
    return this.prisma.user.create({
      data: { ...createUserDto, password: passwordHash },
      omit: {
        password: true,
      },
    });
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

  findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        _count: true,
      },
    });
  }

  findOneById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: true,
      },
    });
  }

  getDelegates(id: number) {
    return this.prisma.delegate.findMany({ where: { userId: id } });
  }

  getForms(id: number) {
    return this.prisma.form.findMany({ where: { userId: id } });
  }

  async getUserDashboardData(id: number) {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: {
        Delegates: true,
        FormSubmissions: true,
        _count: {
          select: {
            Delegates: true,
            FormSubmissions: true,
          },
        },
      },
    });
    return data;
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async validateUser(id: number): Promise<User> {
    console.log('Validating user with ID:', id);
    return this.prisma.user.update({
      where: {
        id,
        valid: false, // Only update if the user is not already valid
      },
      data: {
        valid: true,
      },
    });
  }

  async isValidUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user !== null && user.valid;
  }
}
