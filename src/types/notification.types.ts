import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationMessageResponse {
  @Field()
  message: string;
}

@ObjectType()
export class UnreadCountResponse {
  @Field(() => Int)
  count: number;
}
