import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailQueueProducer } from '../queue/queue.service';

@Injectable()
export class DelegatesService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailQueueProducer,
  ) {}

  async create(data: CreateDelegateDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const formSubmissionCode = uuidv4();
    const delegate: Prisma.DelegateCreateInput = {
      name: data.name,
      formSubmissionCode,
      email: data.email,
      phone: data.phone,
      department: data.department,
      county: user.county,
      supervisor: { connect: { id: userId } },
    };
    const delegateCreated = await this.prisma.delegate.create({
      data: delegate,
    });

    // Send email to delegate with form submission code
    this.mailer.sendMail({
      from: '"LDRI Collect" <serveys@stateofdata.org>',
      to: delegateCreated.email,
      subject: 'Welcome to LDRI Collect',
      text: `Hello ${delegateCreated.name},\n\nYou have been registered as a delegate by ${user.name}. Your form submission code is ${formSubmissionCode}. Use this code to access and complete your form. Click the link below to access your form:\n\nhttps://dca.stateofdata/bridge-form\n\nThank you for your participation in the LDRI program!`,
    });
    return delegateCreated;
  }

  async createMany(data: CreateDelegateDto[], userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const delegates: Prisma.DelegateCreateManyInput[] = data.map((item) => {
      const formSubmissionCode = uuidv4();
      return {
        formSubmissionCode,
        name: item.name,
        email: item.email,
        phone: item.phone,
        department: item.department,
        county: user.county,
        userId: userId,
      };
    });
    const delegatesCreated = await this.prisma.delegate.createManyAndReturn({
      data: delegates,
    });

    // Loop through created delegates and send emails with form submission codes
    for (let i = 0; i < delegatesCreated.length; i++) {
      this.mailer.sendMail({
        from: '"LDRI Collect" <serveys@stateofdata.org>',
        to: delegatesCreated[i].email,
        subject: 'Welcome to LDRI Collect',
        text: `Hello ${delegatesCreated[i].name},\n\nYou have been registered as a delegate by ${user.name}. Your form submission code is ${delegatesCreated[i].formSubmissionCode}. Use this code to access and complete your form. Click the link below to access your form:\n\nhttps://dca.stateofdata/bridge-form\n\nThank you for your participation in the LDRI program!`,
      });
    }

    return delegatesCreated;
  }

  findAll() {
    return this.prisma.delegate.findMany({
      include: { supervisor: true, form: true },
    });
  }

  findOne(formSubmissionCode: string) {
    return this.prisma.delegate.findUnique({
      where: { formSubmissionCode },
      include: { supervisor: true, form: true },
    });
  }

  delete(formSubmissionCode: string) {
    return this.prisma.delegate.delete({
      where: { formSubmissionCode },
    });
  }

  async verifyCode(formSubmissionCode: string) {
    const delegate = await this.prisma.delegate.findUnique({
      where: { formSubmissionCode: formSubmissionCode },
    });
    if (!delegate) {
      throw new UnauthorizedException('Invalid Form Submission Code');
    }
    const form = await this.prisma.form.findUnique({
      where: { formSubmissionCode: formSubmissionCode },
    });
    if (form != null && form.completed) {
      throw new UnauthorizedException('Form already completed');
    }
    return delegate;
  }
}
