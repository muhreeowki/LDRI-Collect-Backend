import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FormsService } from './forms.service';
import { Prisma } from '@prisma/client/ldri/index.js';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  create(@Body() data: Prisma.FormCreateInput) {
    return this.formsService.create(data);
  }

  @Get()
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
