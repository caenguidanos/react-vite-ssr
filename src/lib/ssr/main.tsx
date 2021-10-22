import { routes } from "./routes";
import { SSRConsumer } from "./ssr-context";

const Main: React.FunctionComponent = () => {
   return (
      <SSRConsumer>
         {(ctx) => {
            const route = routes.find((r) => r.path === ctx.page);

            if (route) {
               const pageProps = ctx.props.pageProps;

               if (route.layout) {
                  return (
                     <route.layout>
                        <route.component {...pageProps} />
                     </route.layout>
                  );
               }

               return <route.component {...pageProps} />;
            }

            return <main>Not Found</main>;
         }}
      </SSRConsumer>
   );
};

export default Main;
