import type { FormQuery } from '../store/generated/graphql';
import type { AnswerInput } from '../store/generated/graphql';
import { QT } from '../domain/questionType';

export function buildAnswerInputs(
  form: NonNullable<FormQuery['form']>,
  textById: Record<string, string>,
  dateById: Record<string, string>,
  singleById: Record<string, string | undefined>,
  multiById: Record<string, string[]>,
): AnswerInput[] {
  const ordered = [...form.questions].sort((a, b) => a.order - b.order);

  return ordered.map((q) => {
    switch (q.type) {
      case QT.Text:
        return { questionId: q.id, textValue: textById[q.id] ?? '' };
      case QT.Date:
        return { questionId: q.id, dateValue: dateById[q.id] ?? '' };
      case QT.MultipleChoice: {
        const v = singleById[q.id];
        return { questionId: q.id, selectedOptions: v ? [v] : [] };
      }
      case QT.Checkbox:
        return { questionId: q.id, selectedOptions: multiById[q.id] ?? [] };
      default: {
        const _: never = q.type;
        throw new Error(`Unknown type ${String(_)}`);
      }
    }
  });
}
