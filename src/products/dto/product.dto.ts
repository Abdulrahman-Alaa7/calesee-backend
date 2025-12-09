import { Field, Float, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Stream } from 'stream';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class ProductSizeColorInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  hex: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  catalogColorId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameAr?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  soldout?: boolean;
}

@InputType()
export class ProductSizeInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sizeValue: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  catalogSizeId?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  soldout?: boolean;

  @Field(() => [ProductSizeColorInput], { nullable: true })
  @IsArray()
  @IsOptional()
  colors?: ProductSizeColorInput[];
}

@InputType()
export class ProductImageInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  file?: FileUpload;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  existingUrl?: string;

  @Field({ defaultValue: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  linkedColorHex?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  sortOrder?: number;
}

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  estimatedPrice?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sku?: string;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  publicPro?: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  soldOut?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsEn?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsAr?: string[];

  @Field(() => [ProductImageInput], { nullable: true })
  @IsArray()
  @IsOptional()
  images?: ProductImageInput[];

  @Field(() => [ProductSizeInput], { nullable: true })
  @IsArray()
  @IsOptional()
  sizes?: ProductSizeInput[];
}

@InputType()
export class UpdateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  estimatedPrice?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sku?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  publicPro?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  soldOut?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsEn?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  keywordsAr?: string[];

  @Field(() => [ProductImageInput], { nullable: true })
  @IsArray()
  @IsOptional()
  images?: ProductImageInput[];

  @Field(() => [ProductSizeInput], { nullable: true })
  @IsArray()
  @IsOptional()
  sizes?: ProductSizeInput[];
}
