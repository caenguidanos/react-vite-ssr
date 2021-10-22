import type { Request } from "express";

export type App = React.FunctionComponent<{
   Component: React.FunctionComponent<any>;
   pageProps: unknown;
   Layout: React.FunctionComponent;
}>;

export type Page<K = {}> = React.FunctionComponent<K> & {
   onServerSide?: (ctx: Request) => Promise<{ props?: K; redirect?: string; status?: number }>;
   layout?: React.FunctionComponent;
   head?: React.FunctionComponent<K>;
};

export type PageContext = {
   props: { pageProps: any };
   page: string;
   query: unknown;
   params: Record<string, string>;
};

export type EntryServerRender = (request: Request) => Promise<EntryServerRenderResult>;

export interface EntryServerRenderResult {
   html: string;
   ctx: PageContext;
   status: number;
   redirect?: string;
   message?: string;
   head?: string;
}
