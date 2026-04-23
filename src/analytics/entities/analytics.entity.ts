import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RevenueOverview {
  @Field(() => Float)
  currentMonthRevenue: number;

  @Field(() => Float)
  lastMonthRevenue: number;
}

@ObjectType()
export class OrdersCountOverview {
  @Field(() => Int)
  currentMonthOrdersCount: number;

  @Field(() => Int)
  lastMonthOrdersCount: number;
}

@ObjectType()
export class ChartPoint {
  @Field()
  month: string;

  @Field(() => Float)
  total: number;
}

@ObjectType()
export class ChartDataResponse {
  @Field(() => [ChartPoint])
  chartData: ChartPoint[];
}
