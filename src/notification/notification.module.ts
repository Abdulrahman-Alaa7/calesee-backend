import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    NotificationResolver,
    NotificationService,
    PrismaService,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class NotificationModule {}
