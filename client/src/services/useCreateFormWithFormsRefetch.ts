import { useCallback } from 'react';
import type { CreateFormMutationVariables } from '../store/generated/graphql';
import { api, useCreateFormMutation } from '../store/generated/graphql';
import { useAppDispatch } from '../store/hooks';

export function useCreateFormWithFormsRefetch() {
  const dispatch = useAppDispatch();
  const [mutate, state] = useCreateFormMutation();

  const submit = useCallback(
    async (variables: CreateFormMutationVariables) => {
      const res = await mutate(variables).unwrap();
      void dispatch(
        api.endpoints.Forms.initiate(undefined, { subscribe: false, forceRefetch: true }),
      );
      return res;
    },
    [dispatch, mutate],
  );

  return [submit, state] as const;
}
