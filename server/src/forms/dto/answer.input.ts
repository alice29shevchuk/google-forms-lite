import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => ID)
  questionId!: string;

  @Field(() => String, { nullable: true })
  textValue?: string | null;

  @Field(() => [String], { nullable: true })
  selectedOptions?: string[] | null;

  @Field(() => String, { nullable: true })
  dateValue?: string | null;
}
