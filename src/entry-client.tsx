import { hydrate } from "react-dom";

import { App } from "./_app";
import { SSRProvider } from "./ssr-context";

const ssrDataEl = document.getElementById("__SSR_DATA__") as HTMLScriptElement;

hydrate(
   <SSRProvider value={JSON.parse(ssrDataEl.innerText)}>
      <App />
   </SSRProvider>,
   document.getElementById("__app")
);
