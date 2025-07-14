// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // or email, depending on your auth logic

  @IsString()
  @IsNotEmpty()
  password: string;
}
