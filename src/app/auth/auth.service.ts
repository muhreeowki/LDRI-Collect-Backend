import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { jwtConstants } from './constants';

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
      throw new UnauthorizedException(
        'Missing password. Please provide a password.'
      );
    }
    let user;
    // Check if the user is an admin
    user = await this.adminService.findOne(email);
    // Admin user found
    if (user !== null) {
      // Check if the password is correct
      if (!bcrypt.compareSync(pass, user.password)) {
        throw new UnauthorizedException('Wrong email or password');
      }
      isAdmin = true;
    } else {
      user = await this.usersService.findOne(email);
      if (user !== null && !user.valid) {
        throw new UnauthorizedException('User has not yet been validated');
      } else if (user === null || !bcrypt.compareSync(pass, user?.password)) {
        throw new UnauthorizedException('Wrong email or password');
      }
    }
    // Remove password from the user object before returning
    const { password, ...result } = user;
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isAdmin,
    };
    Logger.debug('User Logged In:', payload);
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1d',
        algorithm: 'HS256',
        audience: 'ldri',
        issuer: 'ldri',
      }),
      message: 'Login successful',
      isAdmin,
    };
  }
}
