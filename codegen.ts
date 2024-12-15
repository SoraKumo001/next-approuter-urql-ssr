import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphqlpokemon.favware.tech/v8",
  documents: "app/gql/*.graphql",
  generates: {
    "app/gql/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
    },
  },
};

export default config;
