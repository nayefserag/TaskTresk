import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
