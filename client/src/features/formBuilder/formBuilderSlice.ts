import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuestionType } from '../../store/generated/graphql';
import { normalizeOptionsForType, nextVariantPlaceholder } from '../../services/formBuilderQuestionType';
import { isChoiceQuestionType } from '../../domain/questionType';

export interface DraftQuestion {
  localId: string;
  order: number;
  type: QuestionType | null;
  prompt: string;
  options: string[];
}

export interface FormBuilderState {
  title: string;
  description: string;
  questions: DraftQuestion[];
}

const initialState: FormBuilderState = {
  title: '',
  description: '',
  questions: [],
};

let idCounter = 0;
const nextLocalId = (): string => {
  idCounter += 1;
  return `local-${idCounter}`;
};

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    addQuestion(state, action: PayloadAction<{ type?: QuestionType | null } | undefined>) {
      const payload = action.payload;
      const type = payload?.type !== undefined ? payload.type ?? null : null;
      const order = state.questions.length;
      state.questions.push({
        localId: nextLocalId(),
        order,
        type,
        prompt: '',
        options: normalizeOptionsForType(type, []),
      });
    },
    setQuestionType(
      state,
      action: PayloadAction<{ localId: string; type: QuestionType | null }>,
    ) {
      const q = state.questions.find((x) => x.localId === action.payload.localId);
      if (!q) return;
      q.type = action.payload.type;
      q.options = normalizeOptionsForType(action.payload.type, q.options);
    },
    updateQuestion(
      state,
      action: PayloadAction<{
        localId: string;
        patch: Partial<Pick<DraftQuestion, 'prompt' | 'type' | 'options'>>;
      }>,
    ) {
      const q = state.questions.find((x) => x.localId === action.payload.localId);
      if (!q) return;
      Object.assign(q, action.payload.patch);
    },
    removeQuestion(state, action: PayloadAction<string>) {
      state.questions = state.questions
        .filter((q) => q.localId !== action.payload)
        .map((q, i) => ({ ...q, order: i }));
    },
    moveQuestion(state, action: PayloadAction<{ localId: string; direction: 'up' | 'down' }>) {
      const idx = state.questions.findIndex((q) => q.localId === action.payload.localId);
      if (idx < 0) return;
      const swapWith =
        action.payload.direction === 'up'
          ? idx - 1
          : idx + 1;
      if (swapWith < 0 || swapWith >= state.questions.length) return;
      const copy = [...state.questions];
      [copy[idx], copy[swapWith]] = [copy[swapWith], copy[idx]];
      state.questions = copy.map((q, i) => ({ ...q, order: i }));
    },
    addOption(state, action: PayloadAction<{ localId: string }>) {
      const q = state.questions.find((x) => x.localId === action.payload.localId);
      if (!q || !isChoiceQuestionType(q.type)) return;
      q.options.push(nextVariantPlaceholder(q.options));
    },
    updateOption(
      state,
      action: PayloadAction<{ localId: string; optionIndex: number; value: string }>,
    ) {
      const q = state.questions.find((x) => x.localId === action.payload.localId);
      if (!q || !isChoiceQuestionType(q.type)) return;
      const { optionIndex, value } = action.payload;
      if (optionIndex >= 0 && optionIndex < q.options.length) {
        q.options[optionIndex] = value;
      }
    },
    removeOption(
      state,
      action: PayloadAction<{ localId: string; optionIndex: number }>,
    ) {
      const q = state.questions.find((x) => x.localId === action.payload.localId);
      if (!q || !isChoiceQuestionType(q.type)) return;
      const { optionIndex } = action.payload;
      if (q.options.length <= 2) return;
      q.options.splice(optionIndex, 1);
    },
    resetBuilder() {
      return { ...initialState };
    },
  },
});

export const formBuilderActions = formBuilderSlice.actions;
export const formBuilderReducer = formBuilderSlice.reducer;
