import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsGateway } from './reviews.gateway';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ReviewsResolver,
    ReviewsService,
    ReviewsGateway,
    PrismaService,
    JwtService,
  ],
})
export class ReviewsModule {}
