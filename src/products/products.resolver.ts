import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, ProductWithRelated } from './entities/product.entity';
import { CreateProductInput, UpdateProductInput } from './dto/product.dto';
import {
  ProductResponse,
  DeleteProductResponse,
} from 'src/types/products.types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductResponse> {
    return await this.productsService.createProduct(input);
  }

  @Mutation(() => ProductResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async updateProduct(
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductResponse> {
    return await this.productsService.updateProduct(input);
  }

  @Mutation(() => DeleteProductResponse)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async deleteProduct(@Args('id') id: string): Promise<DeleteProductResponse> {
    return await this.productsService.deleteProduct(id);
  }

  @Query(() => [Product])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getProductsAdmin(): Promise<Product[]> {
    return await this.productsService.getProductsAdmin();
  }

  @Query(() => Product)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  async getProductByIdAdmin(@Args('id') id: string): Promise<Product> {
    return await this.productsService.getProductByIdAdmin(id);
  }

  @Query(() => [Product])
  async getProductsPublic(): Promise<Product[]> {
    return await this.productsService.getProductsPublic();
  }

  @Query(() => ProductWithRelated)
  async getProductByIdPublic(
    @Args('id') id: string,
  ): Promise<ProductWithRelated> {
    return this.productsService.getProductByIdPublic(id);
  }

  @Query(() => [Product])
  async getTopSellingProducts(): Promise<Product[]> {
    return await this.productsService.getTopSellingProducts();
  }

  @Query(() => [Product])
  async getTopSellingProductsHome(): Promise<Product[]> {
    return await this.productsService.getTopSellingProductsHome();
  }

  @Query(() => [Product])
  async getRecentProducts(): Promise<Product[]> {
    return await this.productsService.getRecentProducts();
  }
}
