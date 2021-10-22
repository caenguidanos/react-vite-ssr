import { routes } from "./routes";
import { SSRConsumer } from "./ssr-context";

import CustomApp from "../../pages/_app";

const Main: React.FunctionComponent = () => {
   return (
      <SSRConsumer>
         {(ctx) => {
            const route = routes.find((r) => r.path === ctx.page);

            if (route) {
               const pageProps = ctx.props.pageProps;

               return (
                  <CustomApp
                     Component={route.component}
                     pageProps={pageProps}
                     Layout={route.layout || (({ children }) => <>{children}</>)}
                  />
               );
            }

            return <main>Not Found</main>;
         }}
      </SSRConsumer>
   );
};

export default Main;
