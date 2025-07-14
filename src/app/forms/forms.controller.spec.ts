import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { PrismaService } from '../prisma.service';

describe('FormsController', () => {
  let controller: FormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [FormsService, PrismaService],
    }).compile();

    controller = module.get<FormsController>(FormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
