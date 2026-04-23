import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

@InputType()
export class ColorDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: 'hex must be a valid hex color code',
  })
  hex: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameAr?: string;
}

@InputType()
export class UpdateColorDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: 'hex must be a valid hex color code',
  })
  hex?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nameAr?: string;
}
