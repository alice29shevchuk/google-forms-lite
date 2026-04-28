import { Field, InputType, Int } from '@nestjs/graphql';
import { QuestionType } from '../enums/question-type.enum';

@InputType()
export class QuestionInput {
  @Field(() => Int)
  order!: number;

  @Field(() => QuestionType)
  type!: QuestionType;

  @Field(() => String)
  prompt!: string;

  @Field(() => [String], { nullable: true })
  options?: string[] | null;
}
