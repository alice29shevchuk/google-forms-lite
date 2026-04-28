import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

export const graphqlClient = new GraphQLClient(graphqlUrl);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    client: graphqlClient,
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
});
