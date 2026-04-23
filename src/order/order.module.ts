import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';
import { OrderGateway } from './order.gateway';
@Module({
  providers: [
    OrderResolver,
    OrderService,
    PrismaService,
    OrderGateway,
    JwtService,
    UsersResolver,
    UsersService,
    ConfigService,
  ],
})
export class OrderModule {}
