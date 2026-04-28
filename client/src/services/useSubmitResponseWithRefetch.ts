import { useCallback } from 'react';
import type { SubmitResponseMutationVariables } from '../store/generated/graphql';
import { api, useSubmitResponseMutation } from '../store/generated/graphql';
import { useAppDispatch } from '../store/hooks';

export function useSubmitResponseWithRefetch(formId: string) {
  const dispatch = useAppDispatch();
  const [mutate, state] = useSubmitResponseMutation();

  const submit = useCallback(
    async (variables: SubmitResponseMutationVariables) => {
      const res = await mutate(variables).unwrap();
      void dispatch(
        api.endpoints.Responses.initiate({ formId }, { subscribe: false, forceRefetch: true }),
      );
      return res;
    },
    [dispatch, formId, mutate],
  );

  return [submit, state] as const;
}
