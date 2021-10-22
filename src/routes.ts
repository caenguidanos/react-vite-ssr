import { Page } from "./types";

const pages = import.meta.globEager("./pages/**/*.tsx");

interface Route {
   path: string;
   component: Page;
   onServerSide: Page["onServerSide"] | undefined;
   layout: Page["layout"] | undefined;
}

export const routes: Route[] = Object.keys(pages).map((path) => {
   const result = path.match(/\.\/pages\/(.*)\.tsx$/);

   if (result) {
      const route = result[1].toLowerCase();

      return {
         path: route === "index" ? "/" : `/${route.replace("/index", "")}`,
         component: pages[path].default,
         onServerSide: pages[path].default.onServerSide,
         layout: pages[path].default.layout,
      };
   }

   throw new Error("Not found any page on pages/ folder");
});
