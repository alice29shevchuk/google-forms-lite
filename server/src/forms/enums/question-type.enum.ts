import { registerEnumType } from '@nestjs/graphql';

export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
});
