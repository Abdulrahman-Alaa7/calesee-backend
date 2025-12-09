import { Field, ObjectType } from '@nestjs/graphql';
import { Size } from 'src/sizes/entities/size.entity';

@ObjectType()
export class SizeResponse {
  @Field(() => Size)
  size: Size;
}

@ObjectType()
export class DeleteSizeResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
