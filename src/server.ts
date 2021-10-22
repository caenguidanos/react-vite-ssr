import fs from "fs";
import path from "path";
import express, { Express, RequestHandler } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import serveStatic from "serve-static";
import compression from "compression";
import { ServerResponse } from "http";

import api from "./api";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const createServer = async (root = process.cwd(), isProd = process.env.NODE_ENV === "production") => {
   const resolve = (p: string) => path.resolve(__dirname, p);

   const indexProd = isProd ? fs.readFileSync(resolve("./client/index.html"), "utf-8") : "";

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
         serveStatic<ServerResponse>(resolve("./client"), {
            index: false,
         })
      );
   }

   app.use("/api", api);

   app.use("*", async (req, res) => {
      try {
         const url = req.originalUrl;

         let template;
         let render;

         if (!isProd) {
            template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
            template = await (vite as ViteDevServer).transformIndexHtml(url, template);

            const entryServer = await (vite as ViteDevServer).ssrLoadModule("/src/entry-server.tsx");

            render = entryServer.render;
         } else {
            template = indexProd;

            render = require("./server/entry-server.js").render;
         }

         const context = {
            query: req.query,
            url: req.originalUrl,
            request: req,
         };

         const { appHtml, propsData, status } = await render(url, context);

         const ssrDataText = JSON.stringify(propsData).replace(/\//g, "\\/");

         const html = template
            .replace("<!--ssr-data-->", `<script id="ssr-data" type="text/json">${ssrDataText}</script>`)
            .replace("<!--ssr-html-->", appHtml);

         res.status(status);
         res.setHeader("Content-Type", "text/html; utf-8");
         res.end(html);
      } catch (e) {
         !isProd && (vite as ViteDevServer).ssrFixStacktrace(e as Error);
         console.error((e as Error).stack);

         res.status(500).end((e as Error).stack);
      }
   });

   return { app, vite };
};

createServer().then(({ app }) => {
   app.listen(3000, () => console.log("Listening :3000"));
});

export { createServer };
