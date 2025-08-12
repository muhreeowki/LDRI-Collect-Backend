import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { AdminService } from '../admin/admin.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AdminService],
  exports: [UsersService], // Export UsersService if needed in other modules
})
export class UsersModule {}
