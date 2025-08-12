import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaService } from '../prisma.service';
import { DelegatesService } from '../delegates/delegates.service';

@Module({
  controllers: [FormsController],
  providers: [FormsService, PrismaService, DelegatesService],
})
export class FormsModule {}
