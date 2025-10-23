import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class NormalAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        audience: 'ldri',
        issuer: 'ldri',
        algorithms: ['HS256'],
      });
      request['user'] = payload;
    } catch (e: any) {
      Logger.error(
        `Error verifying User token: ${e.message}`,
        'AdminAuthGuard',
      );
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}

@Injectable()
// This guard is used to protect admin routes.
export class AdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        audience: 'ldri',
        issuer: 'ldri',
        algorithms: ['HS256'],
      });
      if (!payload.isAdmin) {
        throw new UnauthorizedException('Access denied');
      }
      request['admin'] = payload;
    } catch (e: any) {
      Logger.error(
        `Error verifying Admin token: ${e.message}`,
        'AdminAuthGuard',
      );
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
