import type { Request } from "express";

import type { Page } from "../types";

interface IndexProps {
   message: string;
   path: string;
}

const Index: Page<IndexProps> = ({ message, path }) => {
   return (
      <div className="h-screen">
         <p>{message}</p>
         <b>{path}</b>
      </div>
   );
};

Index.layout = ({ children }) => {
   return (
      <>
         <nav>Super barra de navegación</nav>

         <main>{children}</main>
      </>
   );
};

Index.onServerSide = async (ctx: Request) => {
   return {
      props: {
         path: ctx.originalUrl,
         message: "supermessage",
      },
   };
};

export default Index;
