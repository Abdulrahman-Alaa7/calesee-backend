import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status } from '../../../prisma/generated/client';
import { OrderItem } from './order-item.entity';

registerEnumType(Status, { name: 'Status' });

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  email: string;

  @Field()
  phone_number: string;

  @Field({ nullable: true })
  secPhone_number?: string;

  @Field()
  governorate: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  secAddress?: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Status)
  status: Status;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
