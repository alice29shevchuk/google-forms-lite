import { Field, ID, ObjectType } from '@nestjs/graphql';
import { QuestionEntity } from './question.entity';

@ObjectType('Form')
export class FormEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => [QuestionEntity])
  questions!: QuestionEntity[];
}
