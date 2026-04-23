import { Field, ObjectType } from '@nestjs/graphql';
import { Color } from 'src/colors/entities/color.entity';

@ObjectType()
export class ColorResponse {
  @Field(() => Color)
  color: Color;
}

@ObjectType()
export class DeleteColorResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
