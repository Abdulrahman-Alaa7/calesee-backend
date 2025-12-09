import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Seo {
  @Field()
  id: string;

  @Field()
  page: string;

  @Field()
  titleEn: string;

  @Field()
  titleAr: string;

  @Field()
  descEn: string;

  @Field()
  descAr: string;

  @Field(() => [String])
  keywordsEn: string[];

  @Field(() => [String])
  keywordsAr: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
