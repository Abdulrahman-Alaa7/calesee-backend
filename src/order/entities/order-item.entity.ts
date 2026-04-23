import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field()
  id: string;

  @Field()
  orderId: string;

  @Field()
  productId: string;

  @Field()
  name: string;

  @Field()
  img: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  size?: string;

  @Field()
  quantity: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
