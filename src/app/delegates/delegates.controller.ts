import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { CreateDelegateDto } from './dto/create-delegate.dto';

@Controller('delegates')
export class DelegatesController {
  constructor(private readonly delegatesService: DelegatesService) {}

  @UseGuards(NormalAuthGuard)
  @Post()
  create(@Body() createDelegateDto: CreateDelegateDto, @Request() req: any) {
    const user = req.user || undefined;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.delegatesService.create(createDelegateDto, user.sub);
  }

  @UseGuards(NormalAuthGuard)
  @Post('many')
  createMany(
    @Body() createDelegateDto: CreateDelegateDto[],
    @Request() req: any,
  ) {
    const user = req.user || undefined;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.delegatesService.createMany(createDelegateDto, user.sub);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll() {
    return this.delegatesService.findAll();
  }

  @UseGuards(NormalAuthGuard)
  @Get(':formSubmissionCode')
  findOne(@Param('formSubmissionCode') formSubmissionCode: string) {
    return this.delegatesService.findOne(formSubmissionCode);
  }

  @UseGuards(NormalAuthGuard)
  @Delete(':formSubmissionCode')
  delete(@Param('formSubmissionCode') formSubmissionCode: string) {
    return this.delegatesService.delete(formSubmissionCode);
  }

  @Post('verify')
  verifyCode(@Body('formSubmissionCode') formSubmissionCode: string) {
    return this.delegatesService.verifyCode(formSubmissionCode);
  }
}
