import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingsService } from './settings.service';
import { Setting } from './entities/setting.entity';
import { ShippingZone } from './entities/shipping-zone.entity';
import { SettingsResponse, ShippingPriceResponse } from 'src/types/settings.types';
import { SettingsDto, SettingsUpdateDto } from './dto/settings.dto';
import { MessageResponse } from 'src/types/order.types';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Setting)
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Mutation(() => SettingsResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async creatSettings(
    @Args('settingsDto') settingsDto: SettingsDto,
  ): Promise<SettingsResponse> {
    return await this.settingsService.createSettings(settingsDto);
  }

  @Mutation(() => SettingsResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateSettings(
    @Args('settingsUpdateDto') settingsUpdateDto: SettingsUpdateDto,
  ): Promise<SettingsResponse> {
    return await this.settingsService.updateSettings(settingsUpdateDto);
  }

  @Query(() => [Setting])
  async getSettings() {
    return await this.settingsService.getSettings();
  }

  // ShippingZone queries & mutations

  @Query(() => [ShippingZone])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getShippingZones() {
    return await this.settingsService.getShippingZones();
  }

  @Query(() => ShippingPriceResponse)
  async getShippingPrice(
    @Args('governorate') governorate: string,
  ): Promise<ShippingPriceResponse> {
    return await this.settingsService.getShippingPrice(governorate);
  }

  @Mutation(() => ShippingZone)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async upsertShippingZone(
    @Args('governorate') governorate: string,
    @Args('price', { type: () => Int }) price: number,
  ): Promise<ShippingZone> {
    return await this.settingsService.upsertShippingZone(governorate, price);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteShippingZone(
    @Args('governorate') governorate: string,
  ): Promise<MessageResponse> {
    return await this.settingsService.deleteShippingZone(governorate);
  }
}
