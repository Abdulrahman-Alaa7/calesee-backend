import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Status } from '../../../prisma/generated/client';

@InputType()
export class OrderItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  img: string;

  @Field()
  @Min(0)
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  size?: string;

  @Field()
  @Min(1)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  @IsString()
  @MinLength(3)
  fullName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsString()
  phone_number: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secPhone_number?: string;

  @Field()
  @IsString()
  governorate: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  orderItems: OrderItemInput[];

  @Field()
  @IsIn(['ar', 'en'])
  lang: string;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  @IsString()
  id: string;

  @Field(() => Status)
  status: Status;
}
