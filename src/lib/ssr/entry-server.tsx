import { renderToString } from "react-dom/server";
import { Request } from "express";

import Entry from "./main";
import { SSRProvider } from "./ssr-context";
import { routes } from "./routes";

import type { EntryServerRender, PageContext } from "./ssr.types";

export const render: EntryServerRender = async (request: Request) => {
   const ctx: PageContext = { props: { pageProps: {} }, page: "", query: {}, params: {}, headers: {} };

   try {
      const route = routes.find((r) => r.path === request.originalUrl);

      if (route) {
         let status = 200;
         let redirect: string | undefined = undefined;

         ctx.page = request.originalUrl;
         ctx.query = request.query;
         ctx.headers = request.headers;

         if (route.onServerSide) {
            const serverSideProps = await route.onServerSide(request);

            ctx.props.pageProps = serverSideProps.props;

            if (serverSideProps.status) {
               status = serverSideProps.status;
            }

            if (serverSideProps.redirect) {
               redirect = serverSideProps.redirect;
            }
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
