import type { Page } from "./ssr.types";

const pages = import.meta.globEager("/src/pages/**/*.tsx");

interface Route {
   path: string;
   component: Page;
   onServerSide: Page["onServerSide"] | undefined;
   layout: Page["layout"] | undefined;
   head: Page["head"] | undefined;
}

export const routes: Route[] = Object.keys(pages)
   .filter((r) => !r.match("_app") || !r.match("_document"))
   .map((path) => {
      const result = path.match(/\/src\/pages\/(.*)\.tsx$/);

      if (result) {
         const route = result[1].toLowerCase();

         return {
            path: route === "index" ? "/" : `/${route.replace("/index", "")}`,
            component: pages[path].default,
            onServerSide: pages[path].default.onServerSide,
            layout: pages[path].default.layout,
            head: pages[path].default.head,
         };
      }

      throw new Error("Not found any page on pages/ folder");
   });
