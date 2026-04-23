import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LandingService } from './landing.service';
import { Landing } from './entities/landing.entity';
import { LandingDto, UpdateLandingDto } from './dto/landing.dto';
import {
  LandingResponse,
  DeleteLandingResponse,
} from 'src/types/landing.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Landing)
export class LandingResolver {
  constructor(private readonly landingService: LandingService) {}

  @Mutation(() => LandingResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createLanding(
    @Args('landingDto') landingDto: LandingDto,
  ): Promise<LandingResponse> {
    return await this.landingService.createLanding(landingDto);
  }

  @Mutation(() => LandingResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateLanding(
    @Args('updateLandingDto') updateLandingDto: UpdateLandingDto,
  ): Promise<LandingResponse> {
    return await this.landingService.updateLanding(updateLandingDto);
  }

  @Mutation(() => DeleteLandingResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteLanding(@Args('id') id: string): Promise<DeleteLandingResponse> {
    return await this.landingService.deleteLanding(id);
  }

  @Query(() => [Landing])
  async getLandings(): Promise<Landing[]> {
    return await this.landingService.getLandings();
  }
}
