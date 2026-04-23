import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly service: ReviewsService) {}

  @Mutation(() => Review)
  async createReview(@Args('input') input: CreateReviewDto) {
    return this.service.createReview(input);
  }

  @Query(() => [Review])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getReviewsAdmin(@Args('productId') productId: string) {
    return this.service.getReviewsAdmin(productId);
  }

  @Mutation(() => Review)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateReviewStatus(@Args('input') input: UpdateReviewStatusDto) {
    return this.service.updateStatus(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteReview(@Args('id') id: string) {
    await this.service.deleteReview(id);
    return true;
  }

  @Query(() => [Review])
  async getProductReviews(@Args('productId') productId: string) {
    return this.service.getProductReviews(productId);
  }
}
