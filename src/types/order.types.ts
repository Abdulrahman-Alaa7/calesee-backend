import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from '../order/entities/order.entity';

@ObjectType()
export class OrderResponse {
  @Field(() => Order)
  order: Order;
}

@ObjectType()
export class RecentOrdersResponse {
  @Field(() => [Order])
  recentOrders: Order[];

  @Field()
  ordersThisMonthCount: number;
}

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}
