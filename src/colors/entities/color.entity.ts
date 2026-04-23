import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Color {
  @Field()
  id: string;

  @Field()
  hex: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field({ nullable: true })
  nameAr?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
