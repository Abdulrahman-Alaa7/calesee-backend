import { Field, ObjectType } from '@nestjs/graphql';
import { ProductSizeColor } from './product-size-color.entity';

@ObjectType()
export class ProductSize {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  sizeValue: string;

  @Field({ nullable: true })
  catalogSizeId?: string;

  @Field()
  soldout: boolean;

  @Field(() => [ProductSizeColor])
  colors: ProductSizeColor[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
