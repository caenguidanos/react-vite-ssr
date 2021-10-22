import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { Request } from "express";

import Entry from "./main";
import { SSRProvider } from "./ssr-context";
import { routes } from "./routes";

import type { EntryServerRender, PageContext } from "./ssr.types";
import { ReactElement } from "react";

export const render: EntryServerRender = async (request: Request) => {
   const ctx: PageContext = { props: { pageProps: {} }, page: "", query: {}, params: {} };

   try {
      const route = routes.find((r) => r.path === request.originalUrl);

      if (route) {
         let status = 200;
         let redirect: string | undefined = undefined;

         ctx.page = request.originalUrl;
         ctx.query = request.query;

         if (route.onServerSide) {
            const serverSideProps = await route.onServerSide(request);

            if (serverSideProps.props) {
               ctx.props.pageProps = serverSideProps.props;
            }

            if (serverSideProps.status) {
               status = serverSideProps.status;
            }

            if (serverSideProps.redirect) {
               redirect = serverSideProps.redirect;
            }
         }

         let head: string | undefined;

         if (route.head) {
            const headElement: ReactElement = route.head(ctx.props.pageProps) as ReactElement;
            head = renderToStaticMarkup(headElement);
         }

         return {
            html: renderToString(
               <SSRProvider value={ctx}>
                  <Entry />
               </SSRProvider>
            ),
            ctx,
            status,
            redirect,
            head,
         };
      }

      return { html: renderToString(<main>Not Found</main>), ctx, status: 404 };
   } catch (error) {
      return {
         html: renderToString(
            <main>
               <p>Unavailable Service</p>
               <pre>
                  <code>{JSON.stringify(error as Error, undefined, 3)}</code>
               </pre>
            </main>
         ),
         ctx,
         status: 500,
      };
   }
};
