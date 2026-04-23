import { Field, ObjectType } from '@nestjs/graphql';
import { Landing } from 'src/landing/entities/landing.entity';

@ObjectType()
export class LandingResponse {
  @Field(() => Landing)
  landing: Landing;
}

@ObjectType()
export class DeleteLandingResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
