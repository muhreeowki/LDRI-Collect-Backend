import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  //Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { DelegatesService } from '../delegates/delegates.service';

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly delegateService: DelegatesService,
  ) {}

  @Post(':formSubmissionCode')
  async create(
    @Body() data: Prisma.FormCreateInput,
    @Param('formSubmissionCode') formSubmissionCode: string,
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

  @Get('user/:formId')
  @UseGuards(NormalAuthGuard)
  findOneUser(@Param('formId') formId: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.formsService.userFindOne(formId, userId);
  }

  @Get(':formId')
  @UseGuards(AdminAuthGuard)
  findOneAdmin(@Param('formId') formId: string) {
    return this.formsService.adminFindOne(formId);
  }

  @Delete(':id')
  @UseGuards(NormalAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.formsService.remove(id, userId);
  }
}
