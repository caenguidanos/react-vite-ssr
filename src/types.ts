import type { Request } from "express";
import type { IncomingHttpHeaders } from "http";

export type Page<K = {}> = React.FunctionComponent<K> & {
   onServerSide?: (ctx: Request) => Promise<{ props?: K; redirect?: string; status?: number }>;
   layout?: React.FunctionComponent;
};

export type PageContext = {
   props: { pageProps: any };
   page: string;
   query: unknown;
   params: Record<string, string>;
   headers: IncomingHttpHeaders;
};

export type EntryServerRender = (request: Request) => Promise<EntryServerRenderResult>;

export interface EntryServerRenderResult {
   html: string;
   ctx: PageContext;
   status: number;
   redirect?: string;
}
