import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { NormalAuthGuard } from '../auth/auth.guard';
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
    @Request() req: any
  ) {
    const user = req.user || undefined;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.delegatesService.createMany(createDelegateDto, user.sub);
  }

  @Get()
  findAll() {
    return this.delegatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegatesService.findOne(+id);
  }
}
