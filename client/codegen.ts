import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../packages/shared/graphql/schema.graphql',
  documents: 'src/**/*.graphql',
  ignoreNoDocuments: true,
  generates: {
    './src/store/generated/graphql.ts': {
      plugins: [
        { typescript: { enumsAsTypes: true } },
        { 'typescript-operations': { documentMode: 'string', enumsAsTypes: true } },
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '../api/baseApi',
            exportHooks: true,
          },
        },
      ],
    },
  },
};

export default config;
