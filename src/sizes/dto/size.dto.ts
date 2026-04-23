import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class SizeDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  valueSize: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  labelEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  labelAr?: string;
}

@InputType()
export class UpdateSizeDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  valueSize?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  labelEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  labelAr?: string;
}
