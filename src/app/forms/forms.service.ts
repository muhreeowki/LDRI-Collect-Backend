import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Form, Prisma } from '@prisma/client/ldri/index.js';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FormCreateInput): Promise<Form> {
    return this.prisma.form.create({ data });
  }

  findAll(): Promise<Form[]> {
    return this.prisma.form.findMany();
  }

  findOne(id: string): Promise<Form | null> {
    return this.prisma.form.findUnique({ where: { id } });
  }

  update(id: string, updateFormDto: Prisma.FormUpdateInput) {
    return this.prisma.form.update({
      where: { id },
      data: updateFormDto,
    });
  }

  remove(id: string) {
    return this.prisma.form.delete({
      where: {
        id,
      },
    });
  }
}
