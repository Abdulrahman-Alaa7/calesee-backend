import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductImage {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  isMain: boolean;

  @Field({ nullable: true })
  linkedColorHex?: string;

  @Field({ nullable: true })
  sortOrder?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
