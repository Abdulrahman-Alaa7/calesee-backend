import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field()
  theId: string;

  @Field()
  status: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
