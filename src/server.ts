import fs from "fs";
import path from "path";
import express, { Express, RequestHandler } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import serveStatic from "serve-static";
import compression from "compression";
import { ServerResponse } from "http";

import api from "./api";

import type { EntryServerRender } from "./types";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const createServer = async (root = process.cwd(), isProd = process.env.NODE_ENV === "production") => {
   const indexTemplate = isProd
      ? fs.readFileSync(path.resolve(__dirname, "./client/index.html"), "utf-8")
      : fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");

   const app: Express = express();

   app.use(express.json() as RequestHandler);
   app.use(express.urlencoded({ extended: true }) as RequestHandler);

   let vite: ViteDevServer | undefined = undefined;

   if (!isProd) {
      vite = await createViteServer({
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

      app.use(vite.middlewares);
   } else {
      app.use(compression());

      app.use(
         serveStatic<ServerResponse>(path.resolve(__dirname, "./client"), {
            index: false,
         })
      );
   }

   app.use("/api", api);

   app.use("*", async (req, res) => {
      try {
         let render: EntryServerRender;
         let template: string = indexTemplate;

         if (!isProd) {
            template = await (vite as ViteDevServer).transformIndexHtml(req.originalUrl, template);

            const entryServer = await (vite as ViteDevServer).ssrLoadModule("/src/entry-server.tsx");

            render = entryServer.render;
         } else {
            render = require("./server/entry-server.js").render;
         }

         const serverRender = await render(req);

         if (serverRender.redirect) {
            res.status(serverRender.status || 302);
            res.redirect(serverRender.redirect);

            res.end();
         } else {
            const html = template
               .replace("<!--ssr-data-->", JSON.stringify(serverRender.ctx))
               .replace("<!--ssr-html-->", serverRender.html);

            res.status(serverRender.status || 200);
            res.setHeader("content-type", "text/html; utf-8");

            res.end(html);
         }
      } catch (e) {
         !isProd && (vite as ViteDevServer).ssrFixStacktrace(e as Error);

         console.error((e as Error).stack);

         res.status(500);
         res.end((e as Error).stack);
      }
   });

   return { app, vite };
};

createServer().then(({ app }) => {
   app.listen(3000, () => console.log("Listening :3000"));
});

export { createServer };
