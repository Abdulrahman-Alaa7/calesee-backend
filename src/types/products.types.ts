import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/entities/product.entity';

@ObjectType()
export class ProductResponse {
  @Field(() => Product)
  product: Product;
}

@ObjectType()
export class DeleteProductResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
