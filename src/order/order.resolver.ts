import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import {
  OrderResponse,
  RecentOrdersResponse,
  MessageResponse,
} from '../types/order.types';
import { CreateOrderInput, UpdateOrderStatusInput } from './dto/order.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @Mutation(() => OrderResponse)
  async createOrder(
    @Args('input') input: CreateOrderInput,
  ): Promise<OrderResponse> {
    return await this.ordersService.createOrder(input);
  }

  @Query(() => [Order])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders();
  }

  @Query(() => Order)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getOrderById(@Args('id') id: string): Promise<Order> {
    return await this.ordersService.getOrderById(id);
  }

  @Mutation(() => Order)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateOrderStatus(
    @Args('input') input: UpdateOrderStatusInput,
  ): Promise<Order> {
    return await this.ordersService.updateOrderStatus(input);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteOrder(@Args('id') id: string): Promise<MessageResponse> {
    return await this.ordersService.deleteOrder(id);
  }

  @Query(() => RecentOrdersResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getRecentOrders(): Promise<RecentOrdersResponse> {
    return await this.ordersService.getRecentOrders();
  }
}
