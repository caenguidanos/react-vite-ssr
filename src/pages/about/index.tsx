import DefaultLayout from "../../layouts/default";

import type { Page } from "$ssr";

const About: Page = () => {
   return (
      <main>
         <h1>About</h1>
      </main>
   );
};

About.onServerSide = async () => {
   return {
      redirect: "https://vitejs.dev/", // 302 by default
   };
};

About.layout = DefaultLayout;

export default About;
