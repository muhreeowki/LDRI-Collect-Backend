import { Module } from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { DelegatesController } from './delegates.controller';
import { PrismaService } from '../prisma.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [DelegatesController],
  providers: [DelegatesService, PrismaService],
  exports: [DelegatesService],
})
export class DelegatesModule {}
