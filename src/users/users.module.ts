import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
})
export class UsersModule {}
