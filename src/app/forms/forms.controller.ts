import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { DelegatesService } from '../delegates/delegates.service';
import { UsersService } from '../users/users.service';

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly delegateService: DelegatesService,
    private readonly usersService: UsersService
  ) {}

  @Post(':formSubmissionCode')
  async create(
    @Body() data: Prisma.FormCreateInput,
    @Param('formSubmissionCode') formSubmissionCode: string
  ) {
    // Get the delegate with the formSubmissionCode
    const delegate = await this.delegateService.findOne(formSubmissionCode);
    if (!delegate) {
      throw new Error('Delegate not found with the provided submission code');
    }
    return this.formsService.create(data, delegate);
  }

  @Get()
  @UseGuards(NormalAuthGuard)
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':formId')
  @UseGuards(NormalAuthGuard)
  findOne(@Param('formId') formId: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.formsService.findOne(formId, userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
  //   return this.formsService.update(+id, updateFormDto);
  // }

  @Delete(':id')
  @UseGuards(NormalAuthGuard)
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
