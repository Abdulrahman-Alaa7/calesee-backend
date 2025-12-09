import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class SettingsDto {
  @Field()
  @IsNumber()
  shippingPrice?: number;

  @Field()
  @IsNumber()
  freeShippingPrice?: number;

  @Field()
  @IsString({ message: 'Free Shipping Desc En must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc En is required.' })
  freeShipDescEn: string;

  @Field()
  @IsString({ message: 'Free Shipping Desc Ar must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc Ar is required.' })
  freeShipDescAr: string;

  @Field({ nullable: true })
  @IsString({ message: 'Address must be string' })
  address?: string;

  @Field()
  @IsBoolean({ message: 'Airplane Mode Must be Boolean' })
  airPlaneMode: boolean;
}

@InputType()
export class SettingsUpdateDto {
  @Field()
  @IsString({ message: 'ID must be string' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;

  @Field()
  @IsNumber()
  shippingPrice: number;

  @Field()
  @IsNumber()
  freeShippingPrice: number;

  @Field()
  @IsString({ message: 'Free Shipping Desc En must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc En is required.' })
  freeShipDescEn: string;

  @Field()
  @IsString({ message: 'Free Shipping Desc Ar must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc Ar is required.' })
  freeShipDescAr: string;

  @Field({ nullable: true })
  @IsString({ message: 'Address must be string' })
  address?: string;

  @Field()
  @IsBoolean({ message: 'Airplane Mode Must be Boolean' })
  airPlaneMode: boolean;
}
