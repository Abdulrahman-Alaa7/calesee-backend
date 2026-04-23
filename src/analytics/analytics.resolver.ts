import { Resolver, Query } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import {
  RevenueOverview,
  OrdersCountOverview,
  ChartDataResponse,
} from './entities/analytics.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => RevenueOverview)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getTotalRevenueAnalytics(): Promise<RevenueOverview> {
    return this.analyticsService.getTotalRevenue();
  }

  @Query(() => OrdersCountOverview)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getMonthlyOrdersCountAnalytics(): Promise<OrdersCountOverview> {
    return this.analyticsService.getMonthlyOrdersCount();
  }

  @Query(() => ChartDataResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getTotalRevenueForLastSixMonthsAnalytics(): Promise<ChartDataResponse> {
    return this.analyticsService.getTotalRevenueForLastSixMonths();
  }

  @Query(() => ChartDataResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getTotalOrdersForLastSixMonthsAnalytics(): Promise<ChartDataResponse> {
    return this.analyticsService.getTotalOrdersForLastSixMonths();
  }
}
