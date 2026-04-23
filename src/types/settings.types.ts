import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Setting } from '../settings/entities/setting.entity';
import { ErrorType } from './user.types';

@ObjectType()
export class SettingsResponse {
  @Field(() => Setting)
  settings: Setting | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ShippingPriceResponse {
  @Field(() => Int)
  price: number;

  @Field()
  isDefault: boolean;
}
