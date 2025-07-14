import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { $Enums } from '@prisma/client/ldri/index.js';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'Rock',
      email: 'rock@gmail.io',
      passwordHash: 'supersecret',
      authorizationFile: './authorization.json',
      sex: $Enums.Sex.male,
      nationalId: '222222222',
      county: $Enums.County.homabay,
      position: 'Accountant',
      department: 'Finance',
      phone: '0700000000',
    };
    const createdUser = await service.create(createUserDto);
    console.log('Created User:', createdUser);
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(createUserDto.name);
    expect(createdUser.email).toBe(createUserDto.email);
    expect(createdUser.phone).toBe(createUserDto.phone);
    expect(createdUser.passwordHash).not.toBe(createUserDto.passwordHash); // Password should be hashed
    expect(createdUser.sex).toBe(createUserDto.sex);
    expect(createdUser.nationalId).toBe(createUserDto.nationalId);
    expect(createdUser.county).toBe(createUserDto.county);
    expect(createdUser.position).toBe(createUserDto.position);
    expect(createdUser.department).toBe(createUserDto.department);
  });
});
