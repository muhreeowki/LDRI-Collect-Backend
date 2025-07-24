import { Module } from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { DelegatesController } from './delegates.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DelegatesController],
  providers: [DelegatesService, PrismaService],
})
export class DelegatesModule {}
