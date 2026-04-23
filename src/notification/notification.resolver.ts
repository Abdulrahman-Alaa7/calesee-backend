import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import {
  NotificationMessageResponse,
  UnreadCountResponse,
} from '../types/notification.types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getNotifications(): Promise<Notification[]> {
    return await this.notificationService.getNotifications();
  }

  @Query(() => UnreadCountResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getUnreadNotificationsCount(): Promise<UnreadCountResponse> {
    return await this.notificationService.getUnreadCount();
  }

  @Mutation(() => NotificationMessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async markNotificationAsRead(
    @Args('id') id: string,
  ): Promise<NotificationMessageResponse> {
    return await this.notificationService.markNotificationAsRead(id);
  }

  @Mutation(() => NotificationMessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async markAllNotificationsAsRead(): Promise<NotificationMessageResponse> {
    return await this.notificationService.markAllNotificationsAsRead();
  }

  @Mutation(() => NotificationMessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteNotification(
    @Args('id') id: string,
  ): Promise<NotificationMessageResponse> {
    return await this.notificationService.deleteNotification(id);
  }

  @Mutation(() => NotificationMessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteReadNotifications(): Promise<NotificationMessageResponse> {
    return await this.notificationService.deleteReadNotifications();
  }
}
