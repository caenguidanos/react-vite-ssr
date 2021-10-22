import { Request } from "express";

const Index: React.FunctionComponent<{ message: string; headers: any }> = ({ message, headers }) => {
   return (
      <div className="h-screen">
         <p>{message}</p>

         <pre className="m-10 w-20">
            <code>{JSON.stringify(headers, undefined, 2)}</code>
         </pre>
      </div>
   );
};

export const getServerSideProps = async (request: Request) => {
   return {
      message: "supermessage",
      headers: request.headers,
   };
};

export default Index;
