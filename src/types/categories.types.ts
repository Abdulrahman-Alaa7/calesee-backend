import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';

@ObjectType()
export class CategoryResponse {
  @Field(() => Category)
  category: Category;
}

@ObjectType()
export class DeleteCategoryResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
