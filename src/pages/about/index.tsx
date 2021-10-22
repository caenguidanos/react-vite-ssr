import type { Page } from "$ssr/ssr.types";

const About: Page = () => {
   return (
      <main>
         <h1>About</h1>
      </main>
   );
};

About.layout = ({ children }) => {
   return (
      <>
         <nav>Super barra de navegación desde about</nav>

         <main>{children}</main>
      </>
   );
};

About.onServerSide = async () => {
   return {
      props: {},
      redirect: "https://vitejs.dev/", // 302 by default
   };
};

export default About;
