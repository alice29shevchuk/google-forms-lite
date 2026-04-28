import type { FormBuilderState } from '../features/formBuilder/formBuilderSlice';
import { isChoiceQuestionType } from '../domain/questionType';

export function validateBuilderDraft(state: FormBuilderState): string | null {
  const title = state.title.trim();
  if (!title) {
    return 'Заголовок форми не може бути порожнім.';
  }

  const sorted = [...state.questions].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return 'Додайте хоча б одне запитання.';
  }

  for (const q of sorted) {
    if (q.type === null) {
      return 'Для кожного запитання оберіть тип відповіді у випадаючому списку.';
    }
    const prompt = q.prompt.trim();
    if (!prompt) {
      return 'У кожного запитання має бути непорожній текст.';
    }
    if (isChoiceQuestionType(q.type)) {
      const nonEmpty = q.options.filter((x) => x.trim().length > 0);
      if (nonEmpty.length < 2) {
        return 'Для вибору з варіантів потрібно щонайменше два непорожні варіанти.';
      }
    }
  }

  return null;
}
