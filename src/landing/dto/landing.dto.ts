import { Field, InputType } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

import { Stream } from 'stream';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class LandingDto {
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

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  linkTitleEn: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  linkTitleAr: string;

  @Field(() => GraphQLUpload)
  image: FileUpload | Promise<FileUpload>;
}

@InputType()
export class UpdateLandingDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  link?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  linkTitleEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  linkTitleAr?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload | Promise<FileUpload>;
}
