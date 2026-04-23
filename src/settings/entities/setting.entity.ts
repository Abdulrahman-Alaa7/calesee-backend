import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Setting {
  @Field()
  id: string;

  @Field(() => Int)
  defaultShippingPrice: number;

  @Field(() => Int)
  freeShippingPrice: number;

  @Field()
  freeShipDescEn: string;

  @Field()
  freeShipDescAr: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  airPlaneMode: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
