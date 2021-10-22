import { App } from "$ssr";

const CustomApp: App = ({ Component, pageProps, Layout }) => {
   return (
      <Layout>
         <Component {...pageProps} />
      </Layout>
   );
};

export default CustomApp;
