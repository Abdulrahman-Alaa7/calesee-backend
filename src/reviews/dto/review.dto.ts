import { Field, InputType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Stream } from 'stream';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class CreateReviewDto {
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
  comment: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload | Promise<FileUpload>;
}

@InputType()
export class UpdateReviewStatusDto {
  @Field()
  id: string;

  @Field()
  status: string; // Pending | Approved | Rejected
}
