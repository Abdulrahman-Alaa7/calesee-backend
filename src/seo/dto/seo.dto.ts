import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class SeoDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  page: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  descEn: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  descAr: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsEn?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsAr?: string[];
}

@InputType()
export class UpdateSeoDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  page?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  titleEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  titleAr?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descAr?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsEn?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsAr?: string[];
}
