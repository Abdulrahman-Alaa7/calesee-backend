import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Landing {
  @Field()
  id: string;

  @Field()
  titleEn: string;

  @Field()
  titleAr: string;

  @Field()
  image: string;

  @Field()
  descEn: string;

  @Field()
  descAr: string;

  @Field()
  link: string;

  @Field()
  linkTitleEn: string;

  @Field()
  linkTitleAr: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
