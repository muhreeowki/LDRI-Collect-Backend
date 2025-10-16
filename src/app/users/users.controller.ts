import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { AdminService } from '../admin/admin.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
  ) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('pending')
  @UseGuards(AdminAuthGuard)
  findAllPending() {
    return this.usersService.findAllPending();
  }

  @Get('profile')
  @UseGuards(NormalAuthGuard)
  async getUserProfile(@Request() req: any) {
    return await this.usersService.findOneById(req.user.sub);
  }

  @Get('delegates')
  @UseGuards(NormalAuthGuard)
  async getDelegates(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }
    return this.usersService.getDelegates(user.id);
  }

  @Get('forms')
  @UseGuards(NormalAuthGuard)
  async getForms(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }
    return this.usersService.getForms(user.id);
  }

  @Get('dashboard')
  @UseGuards(NormalAuthGuard)
  async getDashboardData(@Request() req: any) {
    const user = await this.usersService.findOneById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }
    return this.usersService.getUserDashboardData(user.id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('validate/:id')
  async validateUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const adminId = req.admin?.sub;
    if (!adminId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    const isAdmin = await this.adminService.isAdmin(adminId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    return this.usersService.validateUser(id);
  }

  // Keep parameterized route last so it doesn't catch specific routes like 'forms'/'delegates'
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
