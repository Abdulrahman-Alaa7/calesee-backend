import { Field, ObjectType } from '@nestjs/graphql';
import { Seo } from 'src/seo/entities/seo.entity';

@ObjectType()
export class SeoResponse {
  @Field(() => Seo)
  seo: Seo;
}

@ObjectType()
export class DeleteSeoResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
