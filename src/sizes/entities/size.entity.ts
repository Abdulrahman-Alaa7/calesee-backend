import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Size {
  @Field()
  id: string;

  @Field()
  valueSize: string;

  @Field({ nullable: true })
  labelEn?: string;

  @Field({ nullable: true })
  labelAr?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
