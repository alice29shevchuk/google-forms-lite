import type { QuestionType } from '../store/generated/graphql';
import { isChoiceQuestionType } from '../domain/questionType';

export function nextVariantPlaceholder(existingOptions: string[]): string {
  const re = /^Варіант\s+(\d+)\s*$/u;
  let maxNum = 0;
  for (const o of existingOptions) {
    const m = re.exec(o.trim());
    if (m) {
      const n = Number.parseInt(m[1], 10);
      if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
    }
  }
  return `Варіант ${maxNum + 1}`;
}

export function normalizeOptionsForType(
  type: QuestionType | null,
  previousOptions: string[],
): string[] {
  if (type === null) {
    return [];
  }
  if (isChoiceQuestionType(type)) {
    const nonEmpty = previousOptions.map((o) => o.trim()).filter(Boolean);
    return nonEmpty.length >= 2 ? previousOptions : ['Варіант 1', 'Варіант 2'];
  }
  return [];
}
