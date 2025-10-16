import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Prisma } from '@prisma/client/ldri/index.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: Prisma.AdminCreateInput) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get('/find/:id')
  findOneById(@Param('id') id: string) {
    return this.adminService.findOneById(+id);
  }

  @Get()
  findOne(@Body() email: string) {
    return this.adminService.findOne(email);
  }

  @Get('/dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
