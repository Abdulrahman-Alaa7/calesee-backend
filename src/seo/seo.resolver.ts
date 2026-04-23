import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { Seo } from './entities/seo.entity';
import { SeoDto, UpdateSeoDto } from './dto/seo.dto';
import { SeoResponse, DeleteSeoResponse } from 'src/types/seo.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Seo)
export class SeoResolver {
  constructor(private readonly seoService: SeoService) {}

  @Mutation(() => SeoResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createSeo(@Args('seoDto') seoDto: SeoDto): Promise<SeoResponse> {
    return await this.seoService.createSeo(seoDto);
  }

  @Mutation(() => SeoResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateSeo(
    @Args('updateSeoDto') updateSeoDto: UpdateSeoDto,
  ): Promise<SeoResponse> {
    return await this.seoService.updateSeo(updateSeoDto);
  }

  @Mutation(() => DeleteSeoResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteSeo(@Args('id') id: string): Promise<DeleteSeoResponse> {
    return await this.seoService.deleteSeo(id);
  }

  @Query(() => [Seo])
  async getSeos(): Promise<Seo[]> {
    return await this.seoService.getSeos();
  }

  @Query(() => Seo)
  async getSeoByPage(@Args('page') page: string): Promise<Seo> {
    return await this.seoService.getSeoByPage(page);
  }
}
