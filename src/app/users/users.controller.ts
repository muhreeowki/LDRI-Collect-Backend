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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { AdminService } from '../admin/admin.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService
  ) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  //@UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //@UseGuards(NormalAuthGuard)
  @Get(':id')
  findOneById(@Param('id') id: string, @Request() req: any) {
    // if (req.user?.sub !== +id) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this user'
    //   );
    // }
    return this.usersService.findOneById(+id);
  }

  //@UseGuards(NormalAuthGuard)
  @Get(':id/delegates')
  getDelegates(@Param('id') id: string, @Request() req: any) {
    // if (req.user?.sub !== +id) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this user'
    //   );
    // }
    return this.usersService.getDelegates(+id);
  }

  //@UseGuards(NormalAuthGuard)
  @Get(':id/forms')
  getForms(@Param('id') id: string, @Request() req: any) {
    // if (req.user?.sub !== +id) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this user'
    //   );
    // }
    return this.usersService.getForms(+id);
  }

  //@UseGuards(NormalAuthGuard)
  @Get(':id/dashboard')
  getDashboardData(@Param('id') id: string, @Request() req: any) {
    // if (req.user?.sub !== +id) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this user'
    //   );
    // }
    return this.usersService.getUserDashboardData(+id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('validate/:id')
  async validateUser(@Param('id') id: string, @Request() req: any) {
    const adminId = req.admin?.sub;
    if (!adminId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action'
      );
    }
    const isAdmin = await this.adminService.isAdmin(adminId);
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action'
      );
    }
    return this.usersService.validateUser(+id);
  }
}
