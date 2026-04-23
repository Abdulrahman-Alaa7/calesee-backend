import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Stream } from 'stream';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class CategoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @Field(() => GraphQLUpload)
  image: FileUpload | Promise<FileUpload>;
}

@InputType()
export class UpdateCategoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameAr?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload | Promise<FileUpload>;
}
