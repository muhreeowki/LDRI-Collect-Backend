import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Delegate, Form, Prisma } from '@prisma/client/ldri/index.js';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.FormCreateInput, delegate: Delegate): Promise<Form> {
    return this.prisma.form.create({
      data: {
        ...data,
        delegate: {
          connect: { formSubmissionCode: delegate.formSubmissionCode },
        },
        User: {
          connect: { id: delegate.userId },
        },
        score: {
          create: {
            section1: 0,
            section2: 0,
            section3: 0,
            section4: 0,
            section5: 0,
            total: 0,
          },
        },
      },
    });
  }

  findAll(): Promise<Form[]> {
    return this.prisma.form.findMany({
      include: { User: true, delegate: true },
    });
  }

  findOne(id: string): Promise<Form | null> {
    return this.prisma.form.findUnique({
      where: { id },
      include: { User: true, delegate: true, score: true },
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

  async updateScore(id: string, updateScoreDto: Prisma.ScoreUpdateInput) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form) {
      throw new Error('Form not found');
    }
    if (!form.scoreId) {
      throw new Error('Form does not have an associated score');
    }
    return this.prisma.score.update({
      where: { id: form.scoreId },
      data: updateScoreDto,
    });
  }
}
