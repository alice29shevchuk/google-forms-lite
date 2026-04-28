import { useCallback } from 'react';
import type { DeleteFormMutationVariables } from '../store/generated/graphql';
import { api, useDeleteFormMutation } from '../store/generated/graphql';
import { useAppDispatch } from '../store/hooks';

export function useDeleteFormWithFormsRefetch() {
  const dispatch = useAppDispatch();
  const [mutate, state] = useDeleteFormMutation();

  const submit = useCallback(
    async (variables: DeleteFormMutationVariables) => {
      await mutate(variables).unwrap();
      void dispatch(
        api.endpoints.Forms.initiate(undefined, { subscribe: false, forceRefetch: true }),
      );
    },
    [dispatch, mutate],
  );

  return [submit, state] as const;
}
