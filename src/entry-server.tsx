import { renderToString } from "react-dom/server";
import { Request } from "express";

import { App } from "./_app";
import { SSRProvider } from "./ssr-context";
import { routes } from "./routes";

export async function render(
  url: string,
  context: {
    url: string;
    request: Request;
  },
) {
  let data = { url };

  const route = routes.find(r => r.path === url);

  if (route) {
    if (route.getServerSideProps) {
      const props = await route.getServerSideProps(context.request);

      data = props;
      data.url = url;
    }

    const html = renderToString(
      <SSRProvider value={data}>
        <App />
      </SSRProvider>,
    );

    return { appHtml: html, propsData: data, status: 200 };
  }

  const html = renderToString(<main>Not Found</main>);

  return { appHtml: html, propsData: data, status: 404 };
}
