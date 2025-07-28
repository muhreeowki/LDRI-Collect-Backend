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
import { NormalAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @UseGuards(NormalAuthGuard)
  @Put('validate/:id')
  validateUser(@Param('id') id: string, @Request() req: any) {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action'
      );
    }
    return this.usersService.validateUser(+id, adminId);
  }
}
