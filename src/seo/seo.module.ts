import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoResolver } from './seo.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    SeoResolver,
    SeoService,
    PrismaService,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class SeoModule {}
