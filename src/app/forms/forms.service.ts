import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Delegate, Prisma } from '@prisma/client/ldri/index.js';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class FormsService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}

  async create(data: Prisma.FormCreateInput, delegate: Delegate) {
    const form = await this.prisma.form.create({
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
      include: { User: true, delegate: true },
    });
    // Send email to Supervisor with form submission code to view the completed form
    const response = await this.mailer.sendMail({
      from: '"LDRI Collect" <serveys@stateofdata.org>',
      to: form.User?.email,
      subject: 'New Form Submission',
      text: `Hello ${form.User?.name},\n\nA new form has been submitted by your delegate ${delegate.name}. You can view the completed form using the link below:\n\nhttps://dca.stateofdata.org/submissions/${form.id}\n\nThank you for your participation in the LDRI program!`,
    });

    Logger.log(`New form submission: ${form.formSubmissionCode}\n${response}`);
    return form;
  }

  findAll() {
    return this.prisma.form.findMany({
      include: { User: true, delegate: true },
    });
  }

  async userFindOne(id: string, userId: number) {
    const resp = await this.prisma.form.findUnique({
      where: { id, userId },
      include: { User: true, delegate: true },
    });
    console.log('User Find One: ', resp);
    return resp;
  }

  async adminFindOne(id: string) {
    const resp = await this.prisma.form.findUnique({
      where: { id },
      include: { User: true, delegate: true },
    });
    console.log('Admin Find One: ', resp);
    return resp;
  }

  update(id: string, updateFormDto: Prisma.FormUpdateInput) {
    return this.prisma.form.update({
      where: { id },
      data: updateFormDto,
    });
  }

  remove(id: string, userId: number) {
    return this.prisma.form.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
