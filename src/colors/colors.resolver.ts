import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { Color } from './entities/color.entity';
import { ColorDto, UpdateColorDto } from './dto/color.dto';
import { ColorResponse, DeleteColorResponse } from 'src/types/colors.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Color)
export class ColorsResolver {
  constructor(private readonly colorsService: ColorsService) {}

  @Mutation(() => ColorResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createColor(
    @Args('colorDto') colorDto: ColorDto,
  ): Promise<ColorResponse> {
    return await this.colorsService.createColor(colorDto);
  }

  @Mutation(() => ColorResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateColor(
    @Args('updateColorDto') updateColorDto: UpdateColorDto,
  ): Promise<ColorResponse> {
    return await this.colorsService.updateColor(updateColorDto);
  }

  @Mutation(() => DeleteColorResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteColor(@Args('id') id: string): Promise<DeleteColorResponse> {
    return await this.colorsService.deleteColor(id);
  }

  @Query(() => [Color])
  async getColors(): Promise<Color[]> {
    return await this.colorsService.getColors();
  }
}
