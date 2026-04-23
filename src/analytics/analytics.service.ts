import { Injectable } from '@nestjs/common';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import { Status } from '../../prisma/generated/client';
import {
  RevenueOverview,
  OrdersCountOverview,
  ChartDataResponse,
} from './entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalRevenue(): Promise<RevenueOverview> {
    const now = new Date();

    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const lastMonthDate = subMonths(now, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd = endOfMonth(lastMonthDate);

    const currentMonthOrders = await this.prisma.order.findMany({
      where: {
        status: Status.Done,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      include: { items: true },
    });

    const lastMonthOrders = await this.prisma.order.findMany({
      where: {
        status: Status.Done,
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      include: { items: true },
    });

    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((acc, item) => {
        return acc + Number(item.price) * item.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);

    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((acc, item) => {
        return acc + Number(item.price) * item.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);

    return { currentMonthRevenue, lastMonthRevenue };
  }

  async getMonthlyOrdersCount(): Promise<OrdersCountOverview> {
    const now = new Date();

    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    const lastMonthDate = subMonths(now, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd = endOfMonth(lastMonthDate);

    const currentMonthOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    const lastMonthOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    return { currentMonthOrdersCount, lastMonthOrdersCount };
  }

  async getTotalRevenueForLastSixMonths(): Promise<ChartDataResponse> {
    const chartData: { month: string; total: number }[] = [];
    const now = new Date();

    for (let i = 0; i < 6; i++) {
      const targetDate = subMonths(now, i);
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);

      const orders = await this.prisma.order.findMany({
        where: {
          status: Status.Done,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        include: { items: true },
      });

      let monthlyRevenue = 0;
      orders.forEach((order) => {
        order.items.forEach((item) => {
          monthlyRevenue += Number(item.price) * item.quantity;
        });
      });

      const monthName = format(monthStart, 'MMMM');
      // unshift عشان تبقى أقدم → أحدث
      chartData.unshift({ month: monthName, total: monthlyRevenue });
    }

    return { chartData };
  }

  async getTotalOrdersForLastSixMonths(): Promise<ChartDataResponse> {
    const chartData: { month: string; total: number }[] = [];
    const now = new Date();

    for (let i = 0; i < 6; i++) {
      const targetDate = subMonths(now, i);
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);

      const orderCount = await this.prisma.order.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const monthName = format(monthStart, 'MMMM');
      chartData.unshift({ month: monthName, total: orderCount });
    }

    return { chartData };
  }
}
