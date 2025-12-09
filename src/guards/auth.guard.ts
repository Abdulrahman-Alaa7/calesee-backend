import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.cookies['access_token'];
    if (!accessToken) {
      throw new UnauthorizedException('Please login to access this resource!', {
        cause: new Error('UNAUTHENTICATED'),
        description: 'UNAUTHENTICATED',
      });
    }

    try {
      const decodedAccessToken = this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decodedAccessToken.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found!');
      }

      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired access token!', {
        cause: new Error('UNAUTHENTICATED'),
        description: 'UNAUTHENTICATED',
      });
    }
  }
}
