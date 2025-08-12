import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client/ldri/index.js';

describe('FormsService', () => {
  let service: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsService, PrismaService],
    }).compile();

    service = module.get<FormsService>(FormsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a form', async () => {
    const createFormDto: Prisma.FormCreateInput = {
      id: 'form1',
      Q_1_1: 'Answer 1.1 - A',
      Q_1_2: 'Answer 1.2 - A',
      Q_1_3: 'Answer 1.3 - A',
      Q_1_4: 'Answer 1.4 - A',
      Q_1_5: 'Answer 1.5 - A',
      Q_1_5_a: 'Answer 1.5.a - A',
      Q_1_6: 'Answer 1.6 - A',
      Q_1_7: 'Answer 1.7 - A',
      Q_2_1: 'Answer 2.1 - A',
      Q_2_2: 'Answer 2.2 - A',
      Q_2_2_a: 'Answer 2.2.a - A',
      Q_2_3: 'Answer 2.3 - A',
      Q_2_3_a: 'Answer 2.3.a - A',
      Q_2_4: 'Answer 2.4 - A',
      Q_2_4_a: 'Answer 2.4.a - A',
      Q_3_1: 'Answer 3.1 - A',
      Q_3_1_a: 'Answer 3.1.a - A',
      Q_3_2: 'Answer 3.2 - A',
      Q_3_2_a: 'Answer 3.2.a - A',
      Q_3_3: 'Answer 3.3 - A',
      Q_3_3_a: 'Answer 3.3.a - A',
      Q_4_1: 'Answer 4.1 - A',
      Q_4_1_a: 'Answer 4.1.a - A',
      Q_4_2: 'Answer 4.2 - A',
      Q_4_2_a: 'Answer 4.2.a - A',
      Q_4_3: 'Answer 4.3 - A',
      Q_4_4: 'Answer 4.4 - A',
      Q_4_4_a: 'Answer 4.4.a - A',
      Q_4_5: 'Answer 4.5 - A',
      Q_4_5_a: 'Answer 4.5.a - A',
      Q_4_6: 'Answer 4.6 - A',
      Q_4_6_a: 'Answer 4.6.a - A',
      Q_4_7: 'Answer 4.7 - A',
      Q_4_7_a: 'Answer 4.7.a - A',
      Q_4_8: 'Answer 4.8 - A',
      Q_4_8_a: 'Answer 4.8.a - A',
      Q_4_9: 'Answer 4.9 - A',
      Q_4_9_a: 'Answer 4.9.a - A',
      Q_4_10: 'Answer 4.10 - A',
      Q_4_10_a: 'Answer 4.10.a - A',
      Q_5_1: 'Answer 5.1 - A',
      Q_5_1_a: 'Answer 5.1.a - A',
      Q_5_2: 'Answer 5.2 - A',
      Q_5_2_a: 'Answer 5.2.a - A',
      Q_5_3: 'Answer 5.3 - A',
      Q_5_4: 'Answer 5.4 - A',
      Q_5_4_a: 'Answer 5.4.a - A',
      Q_5_5: 'Answer 5.5 - A',
      Q_5_5_a: 'Answer 5.5.a - A',
    };

    const createdForm = await service.create(createFormDto);
    expect(createdForm).toHaveProperty('id');
    expect(createdForm).toEqual(createFormDto);
  });
});
