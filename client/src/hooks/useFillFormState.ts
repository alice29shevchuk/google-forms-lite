import { useCallback, useState } from 'react';
import type { FormQuery } from '../store/generated/graphql';

export interface UseFillFormStateResult {
  textById: Record<string, string>;
  dateById: Record<string, string>;
  singleById: Record<string, string | undefined>;
  multiById: Record<string, string[]>;
  setText: (id: string, value: string) => void;
  setDate: (id: string, value: string) => void;
  setSingle: (id: string, value: string) => void;
  toggleMulti: (id: string, option: string, checked: boolean) => void;
  reset: () => void;
}

type FieldBundle = Pick<
  UseFillFormStateResult,
  'textById' | 'dateById' | 'singleById' | 'multiById'
>;

function emptyState(form: NonNullable<FormQuery['form']>): FieldBundle {
  const textById: Record<string, string> = {};
  const dateById: Record<string, string> = {};
  const singleById: Record<string, string | undefined> = {};
  const multiById: Record<string, string[]> = {};

  for (const q of form.questions) {
    textById[q.id] = '';
    dateById[q.id] = '';
    singleById[q.id] = undefined;
    multiById[q.id] = [];
  }

  return { textById, dateById, singleById, multiById };
}

export function useFillFormState(form: NonNullable<FormQuery['form']>): UseFillFormStateResult {
  const [fields, setFields] = useState<FieldBundle>(() => emptyState(form));

  const reset = useCallback(() => {
    setFields(emptyState(form));
  }, [form]);

  const setText = useCallback((id: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      textById: { ...prev.textById, [id]: value },
    }));
  }, []);

  const setDate = useCallback((id: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      dateById: { ...prev.dateById, [id]: value },
    }));
  }, []);

  const setSingle = useCallback((id: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      singleById: { ...prev.singleById, [id]: value },
    }));
  }, []);

  const toggleMulti = useCallback((id: string, option: string, checked: boolean) => {
    setFields((prev) => {
      const cur = prev.multiById[id] ?? [];
      const nextList = checked ? [...cur, option] : cur.filter((x) => x !== option);
      return {
        ...prev,
        multiById: { ...prev.multiById, [id]: nextList },
      };
    });
  }, []);

  return {
    textById: fields.textById,
    dateById: fields.dateById,
    singleById: fields.singleById,
    multiById: fields.multiById,
    setText,
    setDate,
    setSingle,
    toggleMulti,
    reset,
  };
}
