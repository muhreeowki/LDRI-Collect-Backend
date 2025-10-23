import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { AdminService } from '../admin/admin.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [UsersService, PrismaService, AdminService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService if needed in other modules
})
export class UsersModule {}
