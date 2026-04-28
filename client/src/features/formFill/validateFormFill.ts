import type { QuestionType } from '../../store/generated/graphql';
import { QT } from '../../domain/questionType';

export function validateFillAnswers(
  questions: Array<{ id: string; order: number; prompt: string; type: QuestionType }>,
  getText: (questionId: string) => string,
  getDate: (questionId: string) => string,
  getSingle: (questionId: string) => string | undefined,
  getMulti: (questionId: string) => string[],
): string | null {
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  for (const q of sorted) {
    switch (q.type) {
      case QT.Text:
        if (!getText(q.id).trim()) {
          return `Заповніть текстове поле «${q.prompt || q.id}».`;
        }
        break;
      case QT.Date: {
        const d = getDate(q.id).trim();
        if (!d) {
          return `Оберіть дату для «${q.prompt || q.id}».`;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
          return `Дата має бути у форматі РРРР-ММ-ДД для «${q.prompt || q.id}».`;
        }
        break;
      }
      case QT.MultipleChoice:
        if (!getSingle(q.id)) {
          return `Оберіть варіант для «${q.prompt || q.id}».`;
        }
        break;
      case QT.Checkbox: {
        const vals = getMulti(q.id);
        if (vals.length < 1) {
          return `Оберіть принаймні один варіант для «${q.prompt || q.id}».`;
        }
        break;
      }
    }
  }

  return null;
}
