import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AnswerEntity } from './answer.entity';

@ObjectType('Response')
export class ResponseEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  formId!: string;

  @Field(() => [AnswerEntity])
  answers!: AnswerEntity[];
}
