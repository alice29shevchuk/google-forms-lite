import type { DraftQuestion } from '../features/formBuilder/formBuilderSlice';
import type { QuestionInput } from '../store/generated/graphql';
import { isChoiceQuestionType } from '../domain/questionType';

function assertTyped(q: DraftQuestion): asserts q is DraftQuestion & { type: NonNullable<DraftQuestion['type']> } {
  if (q.type === null) {
    throw new Error('Питання без типу: спочатку пройдіть валідацію білдера.');
  }
}

export function draftQuestionsToInputs(questions: DraftQuestion[]): QuestionInput[] {
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  return sorted.map((q): QuestionInput => {
    assertTyped(q);
    return {
      order: q.order,
      type: q.type,
      prompt: q.prompt.trim(),
      options: isChoiceQuestionType(q.type) ? [...q.options] : undefined,
    };
  });
}
