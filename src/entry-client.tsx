import { hydrate } from "react-dom";

import { App } from "./_app";
import { SSRProvider } from "./ssr-context";

const text = document.getElementById("ssr-data")?.innerText;
const props = JSON.parse(text || "{}");

hydrate(
  <SSRProvider value={props}>
    <App />
  </SSRProvider>,
  document.getElementById("app"),
);
