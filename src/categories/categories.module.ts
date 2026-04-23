import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    CategoriesResolver,
    CategoriesService,
    PrismaService,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class CategoriesModule {}
