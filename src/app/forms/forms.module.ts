import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaService } from '../prisma.service';
import { DelegatesService } from '../delegates/delegates.service';
import { UsersService } from '../users/users.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [FormsController],
  providers: [FormsService, PrismaService, DelegatesService, UsersService],
})
export class FormsModule {}
