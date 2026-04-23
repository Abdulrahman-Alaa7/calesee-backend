import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesResolver } from './sizes.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    SizesResolver,
    SizesService,
    PrismaService,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class SizesModule {}
