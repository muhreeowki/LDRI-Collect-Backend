import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // TODO: Test this
  async login(email: string, pass: string): Promise<any> {
    let isAdmin = false;

    if (pass === '' || pass === undefined || pass === null) {
      throw new UnauthorizedException('Password is required');
    }
    // Check if the user is an admin
    let user = await this.adminService.findOne(email);
    // Admin user found
    if (user !== null) {
      // Check if the password is correct
      if (!bcrypt.compareSync(pass, user.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }
      isAdmin = true;
    } else {
      user = await this.usersService.findOne(email);
      if (user === null || !bcrypt.compareSync(pass, user?.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    const { password, ...result } = user;
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdmin,
    };
    console.log('User Authenticated Token:', result);
    return {
      accessToken: await this.jwtService.signAsync(payload),
      message: 'Login successful',
      isAdmin,
    };
  }
}
