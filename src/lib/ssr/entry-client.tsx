import { hydrate } from "react-dom";

import Entry from "./main";
import { SSRProvider } from "./ssr-context";

const ssrDataEl = document.getElementById("__DATA__") as HTMLScriptElement;

hydrate(
   <SSRProvider value={JSON.parse(ssrDataEl.innerText)}>
      <Entry />
   </SSRProvider>,
   document.getElementById("root")
);
