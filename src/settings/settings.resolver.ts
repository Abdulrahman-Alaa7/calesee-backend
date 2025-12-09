import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingsService } from './settings.service';
import { Setting } from './entities/setting.entity';
import { SettingsResponse } from 'src/types/settings.types';
import { SettingsDto, SettingsUpdateDto } from './dto/settings.dto';
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
}
