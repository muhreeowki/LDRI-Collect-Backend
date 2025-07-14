import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (
      user === null ||
      user?.password === undefined ||
      !bcrypt.compareSync(pass, user?.password)
    ) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    return result;
  }
}
