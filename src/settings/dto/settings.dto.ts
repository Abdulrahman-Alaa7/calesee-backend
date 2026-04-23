import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class SettingsDto {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  defaultShippingPrice: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
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

@InputType()
export class SettingsUpdateDto {
  @Field()
  @IsString({ message: 'ID must be string' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  defaultShippingPrice: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
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
