import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as cron from 'node-cron';
import { Notification } from './entities/notification.entity';
import {
  NotificationMessageResponse,
  UnreadCountResponse,
} from 'src/types/notification.types';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.scheduleNotificationCleanup();
  }

  private scheduleNotificationCleanup() {
    cron.schedule('0 0 0 * * *', async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      await this.prisma.notification.deleteMany({
        where: {
          createdAt: { lt: thirtyDaysAgo },
        },
      });
    });
  }

  async getNotifications(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const count = await this.prisma.notification.count({
      where: { status: false },
    });

    return { count };
  }

  async markNotificationAsRead(
    id: string,
  ): Promise<NotificationMessageResponse> {
    const exists = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException('Notification not found');
    }

    await this.prisma.notification.update({
      where: { id },
      data: { status: true },
    });

    return { message: 'Notification marked as read successfully' };
  }

  async markAllNotificationsAsRead(): Promise<NotificationMessageResponse> {
    await this.prisma.notification.updateMany({
      where: { status: false },
      data: { status: true },
    });

    return { message: 'All notifications marked as read successfully' };
  }

  async deleteNotification(id: string): Promise<NotificationMessageResponse> {
    const exists = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return { message: 'Notification deleted successfully' };
  }

  async deleteReadNotifications(): Promise<NotificationMessageResponse> {
    await this.prisma.notification.deleteMany({
      where: { status: true },
    });

    return { message: 'Read notifications deleted successfully' };
  }
}
