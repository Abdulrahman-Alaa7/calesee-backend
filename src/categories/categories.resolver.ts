import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  CategoryResponse,
  DeleteCategoryResponse,
} from 'src/types/categories.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CategoryResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createCategory(
    @Args('categoryDto') categoryDto: CategoryDto,
  ): Promise<CategoryResponse> {
    return await this.categoriesService.createCategory(categoryDto);
  }

  @Mutation(() => CategoryResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateCategory(
    @Args('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    return await this.categoriesService.updateCategory(updateCategoryDto);
  }

  @Mutation(() => DeleteCategoryResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteCategory(
    @Args('id') id: string,
  ): Promise<DeleteCategoryResponse> {
    return await this.categoriesService.deleteCategory(id);
  }

  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }
}
