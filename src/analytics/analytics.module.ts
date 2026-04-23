import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    AnalyticsResolver,
    AnalyticsService,
    PrismaService,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class AnalyticsModule {}
