import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Answer')
export class AnswerEntity {
  @Field(() => ID)
  questionId!: string;

  @Field(() => String, { nullable: true })
  textValue?: string | null;

  @Field(() => [String], { nullable: true })
  selectedOptions?: string[] | null;

  @Field(() => String, { nullable: true })
  dateValue?: string | null;
}
