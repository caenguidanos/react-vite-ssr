import DefaultLayout from "../layouts/default";

import type { Request } from "express";
import type { Page } from "$ssr";

interface IndexProps {
   message: string;
   path: string;
}

const Index: Page<IndexProps> = ({ message, path }) => {
   return (
      <div>
         <h4>From server:</h4>

         <p>Message: {message}</p>
         <p>Path: {path}</p>
      </div>
   );
};

Index.head = ({ message }) => {
   return (
      <>
         <title>Title 1</title>
         <meta name="description" content={message} />
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

Index.layout = DefaultLayout;

export default Index;
