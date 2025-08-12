import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client/ldri/index.js';
import { AdminAuthGuard, NormalAuthGuard } from '../auth/auth.guard';
import { DelegatesService } from '../delegates/delegates.service';

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly delegateService: DelegatesService
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
  //@UseGuards(AdminAuthGuard)
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
  //   return this.formsService.update(+id, updateFormDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.formsService.remove(+id);
  // }
}
