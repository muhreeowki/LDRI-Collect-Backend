import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Delegate, Form, Prisma } from '@prisma/client/ldri/index.js';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FormCreateInput, delegate: Delegate): Promise<Form> {
    const form = this.prisma.form.create({
      data: {
        ...data,
        completed: true,
        delegate: {
          connect: { formSubmissionCode: delegate.formSubmissionCode },
        },
        User: {
          connect: { id: delegate.userId },
        },
      },
    });
    // TODO: send email to Supervisor with form submission code to view the completed form
    return form;
  }

  findAll(): Promise<Form[]> {
    return this.prisma.form.findMany({
      include: { User: true, delegate: true },
    });
  }

  findOne(id: string, userId: number) {
    return this.prisma.form.findUnique({
      where: { id, userId },
      include: { User: true, delegate: true },
    });
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
