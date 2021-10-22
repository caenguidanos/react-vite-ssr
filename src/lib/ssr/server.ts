import fs from "fs";
import path from "path";
import express, { Express, RequestHandler } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import serveStatic from "serve-static";
import compression from "compression";
import { ServerResponse } from "http";

import type { EntryServerRender } from "./ssr.types";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const createServer = async (root = process.cwd(), isProd = process.env.NODE_ENV === "production") => {
   const indexTemplateContent = getIndexTemplateContent(isProd);

   const app: Express = express();

   app.use(express.json() as RequestHandler);
   app.use(express.urlencoded({ extended: true }) as RequestHandler);

   let vite: ViteDevServer | undefined = undefined;

   if (isProd) {
      const apiRouterPath = path.resolve(__dirname, "api/index.js");
      const staticFilesPath = path.resolve(process.cwd(), "dist", "client");

      const staticMiddleware = serveStatic<ServerResponse>(staticFilesPath, {
         index: false,
      });

      app.use(compression());
      app.use(staticMiddleware);

      app.use("/api", require(apiRouterPath).default);

      app.use("*", async (req, res) => {
         try {
            const { render } = require("./entry/entry-server.js");
            const { redirect, status, ctx, html } = await (render as EntryServerRender)(req);

            if (redirect) {
               res.status(status || 302);
               res.redirect(redirect);

               return res.end();
            }

            if (status === 200) {
               const content = indexTemplateContent
                  .replace("<!--ssr-data-->", JSON.stringify(ctx))
                  .replace("<!--ssr-html-->", html);

               res.status(status);
               res.setHeader("content-type", "text/html; utf-8");

               return res.end(content);
            }
         } catch (e) {
            res.status(500);

            return res.end((e as Error).stack);
         }
      });
   } else {
      const vite: ViteDevServer = await getViteServer(root);

      app.use(vite.middlewares);

      const apiRouterPath = path.join(process.cwd(), "src", "api");

      app.use("/api", require(apiRouterPath).default);

      app.use("*", async (req, res) => {
         try {
            const template = await vite.transformIndexHtml(req.originalUrl, indexTemplateContent);
            const { render } = await vite.ssrLoadModule("/src/lib/ssr/entry-server.tsx");
            const { redirect, status, ctx, html } = await (render as EntryServerRender)(req);

            if (redirect) {
               res.status(status || 302);
               res.redirect(redirect);

               return res.end();
            }

            if (status === 200) {
               const content = template
                  .replace("<!--ssr-data-->", JSON.stringify(ctx))
                  .replace("<!--ssr-html-->", html);

               res.status(status);
               res.setHeader("content-type", "text/html; utf-8");

               return res.end(content);
            }
         } catch (e) {
            vite.ssrFixStacktrace(e as Error);

            res.status(500);

            return res.end((e as Error).stack);
         }
      });
   }

   return { app, vite };
};

createServer().then(({ app }) => {
   app.listen(3000, () => console.log("Listening :3000"));
});

function getIndexTemplateContent(isProd: boolean): string {
   const indexTemplatePath = isProd
      ? path.resolve(__dirname, "./client/index.html")
      : path.join(process.cwd(), "index.html");

   return fs.readFileSync(indexTemplatePath, "utf-8");
}

async function getViteServer(root: string): Promise<ViteDevServer> {
   return createViteServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
         middlewareMode: true,
         watch: {
            usePolling: true,
            interval: 100,
         },
      },
   });
}

export { createServer };
