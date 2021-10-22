import { routes } from "./routes";
import { SSRConsumer } from "./ssr-context";

import "./styles/index.css";

export const App: React.FunctionComponent = () => {
  return (
    <SSRConsumer>
      {pageProps => {
        const route = routes.find(r => r.path === pageProps.url);

        if (route) {
          return <route.component {...pageProps} />;
        }

        return <main>Not Found</main>;
      }}
    </SSRConsumer>
  );
};

export default App;
