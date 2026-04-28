import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { QuestionType } from '../enums/question-type.enum';

@ObjectType('Question')
export class QuestionEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  order!: number;

  @Field(() => QuestionType)
  type!: QuestionType;

  @Field(() => String)
  prompt!: string;

  @Field(() => [String], { nullable: true })
  options?: string[] | null;
}
