import { createContext } from "react";

import type { PageContext } from "./types";

const { Provider, Consumer } = createContext<PageContext>({
   page: "",
   params: {},
   query: {},
   headers: {},
   props: {
      pageProps: {},
   },
});

export const SSRProvider = Provider;
export const SSRConsumer = Consumer;
