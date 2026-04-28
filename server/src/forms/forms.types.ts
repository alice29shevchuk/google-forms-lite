import type { QuestionType } from './enums/question-type.enum';

export interface StoredQuestion {
  id: string;
  order: number;
  type: QuestionType;
  prompt: string;
  options?: string[];
}

export interface StoredForm {
  id: string;
  title: string;
  description?: string;
  questions: StoredQuestion[];
}

export interface StoredAnswer {
  questionId: string;
  textValue?: string;
  selectedOptions?: string[];
  dateValue?: string;
}

export interface StoredResponse {
  id: string;
  formId: string;
  answers: StoredAnswer[];
}
