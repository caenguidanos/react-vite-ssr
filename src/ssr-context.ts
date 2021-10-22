import { createContext } from "react";

const { Provider, Consumer } = createContext<any>({});

export const SSRProvider = Provider;
export const SSRConsumer = Consumer;
