import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { Size } from './entities/size.entity';
import { SizeDto, UpdateSizeDto } from './dto/size.dto';
import { SizeResponse, DeleteSizeResponse } from 'src/types/sizes.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Size)
export class SizesResolver {
  constructor(private readonly sizesService: SizesService) {}

  @Mutation(() => SizeResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createSize(@Args('sizeDto') sizeDto: SizeDto): Promise<SizeResponse> {
    return await this.sizesService.createSize(sizeDto);
  }

  @Mutation(() => SizeResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateSize(
    @Args('updateSizeDto') updateSizeDto: UpdateSizeDto,
  ): Promise<SizeResponse> {
    return await this.sizesService.updateSize(updateSizeDto);
  }

  @Mutation(() => DeleteSizeResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteSize(@Args('id') id: string): Promise<DeleteSizeResponse> {
    return await this.sizesService.deleteSize(id);
  }

  @Query(() => [Size])
  async getSizes(): Promise<Size[]> {
    return await this.sizesService.getSizes();
  }
}
