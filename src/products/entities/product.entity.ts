import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ProductImage } from './product-image.entity';
import { ProductSize } from './product-size.entity';
import { Review } from 'src/reviews/entities/review.entity';

@ObjectType()
export class ProductCategory {
  @Field()
  id: string;

  @Field()
  nameEn: string;

  @Field()
  nameAr: string;
}

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  categoryId: string;

  @Field(() => ProductCategory, { nullable: true })
  category?: ProductCategory;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  estimatedPrice?: number;

  @Field({ nullable: true })
  sku?: string;

  @Field()
  publicPro: boolean;

  @Field()
  soldOut: boolean;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field({ nullable: true })
  descriptionAr?: string;

  @Field(() => [String])
  keywordsEn: string[];

  @Field(() => [String])
  keywordsAr: string[];

  @Field(() => [ProductImage])
  images: ProductImage[];

  @Field(() => [ProductSize])
  sizes: ProductSize[];

  @Field({ nullable: true })
  purchased?: number;

  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductWithRelated {
  @Field(() => Product)
  product: Product;

  @Field(() => [Product])
  relatedProducts: Product[];
}
