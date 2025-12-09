import { ObjectType, Field } from '@nestjs/graphql';
import { Setting } from '../settings/entities/setting.entity';
import { ErrorType } from './user.types';

@ObjectType()
export class SettingsResponse {
  @Field(() => Setting)
  settings: Setting | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
