import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { v4 as uuidv4 } from 'uuid';

// TODO: When delegates are created, they should receive an email
// with a link to fill in the bridge form. The email should include
// a unique submission code that they will use to submit the form.

@Injectable()
export class DelegatesService {
  constructor(private prisma: PrismaService) {}

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

    // TODO: Send email to delegate with submission code
    console.log('Delegate created:', delegateCreated);

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
    const delegatesCreated = await this.prisma.delegate.createMany({
      data: delegates,
    });

    // TODO: Loop through created delegates and send emails

    return delegatesCreated;
  }

  findAll() {
    return this.prisma.delegate.findMany();
  }

  findOne(formSubmissionCode: string) {
    return this.prisma.delegate.findUnique({
      where: { formSubmissionCode },
    });
  }
}
