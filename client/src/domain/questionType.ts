import type { QuestionType } from '../store/generated/graphql';

export const QT = {
  Text: 'TEXT',
  Date: 'DATE',
  MultipleChoice: 'MULTIPLE_CHOICE',
  Checkbox: 'CHECKBOX',
} as const;

export const QUESTION_TYPE_OPTIONS: ReadonlyArray<{ value: QuestionType; label: string }> = [
  { value: QT.Text, label: 'Коротка відповідь (текст)' },
  { value: QT.MultipleChoice, label: 'Один варіант (список)' },
  { value: QT.Checkbox, label: 'Кілька варіантів (чекбокси)' },
  { value: QT.Date, label: 'Дата' },
];

export function isChoiceQuestionType(type: QuestionType | null): boolean {
  return type === QT.MultipleChoice || type === QT.Checkbox;
}
