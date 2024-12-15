# react-query-ssr

## overview

SSR functionality with Urql.

Provides SSR functionality from `Next.js`‘s `Pages Router` and `App Router`’s `Client Component`.
It also works with `React Router`.

SSR does not use the functionality of the respective frameworks and works only with standard React functionality.
Therefore, it does not require any environment.

## URL of sample program

<https://next-approuter-urql-ssr.vercel.app/>  
<https://github.com/SoraKumo001/next-approuter-urql-ssr>

## Notes.

Do not use `<Suspense>` for components using useSSR in ServerSide.
You will not be able to wait for asynchronous data.

## Installation

- codegen.ts

```ts
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
```

```sh
# Automatically create GraphQL operations (app/gql/query.graphql)
npm run graphql-auto-query https://graphqlpokemon.favware.tech/v8 -d 1 -o app/gql/query.graphql
# Create Hooks for Urql
npm run graphql-codegen --config codegen.ts
```

## Example

- app/UrqlProvider.tsx

Set up an Exchange for SSR.

```tsx
"use client";

import { Provider, cacheExchange, createClient, fetchExchange } from "urql";
import { FC, ReactNode, useState } from "react";
import {
  useCreateNextSSRExchange,
  NextSSRProvider,
} from "@react-libraries/next-exchange-ssr";

const isServer = typeof window === "undefined";

export const UrqlProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const nextSSRExchange = useCreateNextSSRExchange();
  const [queryClient] = useState(() =>
    createClient({
      url: "https://graphqlpokemon.favware.tech/v8",
      suspense: isServer,
      exchanges: [cacheExchange, nextSSRExchange, fetchExchange],
    })
  );
  return (
    <Provider value={queryClient}>
      <NextSSRProvider>{children}</NextSSRProvider>
    </Provider>
  );
};
```

- app/Layout.tsx

```tsx
import { UrqlProvider } from "./UrqlProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UrqlProvider>
        <body>{children}</body>
      </UrqlProvider>
    </html>
  );
}
```

- src/app/[page]/page.tsx

```tsx
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAllPokemonQuery } from "../gql/graphql";

const Page = () => {
  const params = useParams();
  const page = Number(params["page"] ?? 1);
  const [result] = useGetAllPokemonQuery({
    variables: { take: 10, offset: (page - 1) * 10, takeFlavorTexts: 1 },
  });

  const data = result.data?.getAllPokemon;

  if (!data || result.fetching) return <div>loading</div>;

  return (
    <>
      <title>Pokemon List</title>
      <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
        <Link
          href={page > 1 ? `/${page - 1}` : ""}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏪️
        </Link>
        <Link
          href={`/${page + 1}`}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏩️
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div>
        {data.map(({ key }) => (
          <div key={key}>
            <Link href={`/pokemon/${key}`}>{key}</Link>
          </div>
        ))}
      </div>
    </>
  );
};
export default Page;
```

- src/app/pokemon/[name]/page.tsx

```tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PokemonEnum, useGetPokemonQuery } from "../../gql/graphql";

const Page = () => {
  const params = useParams();
  const name = String(params["name"]);
  const [result] = useGetPokemonQuery({
    variables: { pokemon: name as PokemonEnum },
  });

  const data = result.data?.getPokemon;

  if (!data || result.fetching) return <div>loading</div>;
  return (
    <>
      <title>{name}</title>
      <div style={{ padding: "8px" }}>
        <Link
          href="/1"
          style={{
            textDecoration: "none",
            padding: "8px 32px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          ⏪️List
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <img
          style={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)" }}
          src={data.sprite}
        />
        <div>{name}</div>
      </div>
    </>
  );
};
export default Page;
```
