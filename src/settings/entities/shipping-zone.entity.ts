import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ShippingZone {
  @Field()
  id: string;

  @Field()
  governorate: string;

  @Field(() => Int)
  price: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
