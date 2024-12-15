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
