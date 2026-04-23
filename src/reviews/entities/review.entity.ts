import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  comment: string;

  @Field()
  rating: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
}
