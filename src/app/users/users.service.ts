import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client/ldri/index.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: Prisma.UserCreateInput): Promise<User> {
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
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findOneById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
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

  async validateUser(id: number, adminId: number): Promise<User> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (admin === null) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action'
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: { valid: true },
    });
  }

  async isValidUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user !== null && user.valid;
  }
}
