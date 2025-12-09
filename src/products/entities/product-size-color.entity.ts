import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductSizeColor {
  @Field()
  id: string;

  @Field()
  hex: string;

  @Field({ nullable: true })
  catalogColorId?: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field({ nullable: true })
  nameAr?: string;

  @Field()
  soldout: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
