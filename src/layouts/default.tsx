import Navbar from "../components/navbar";

const DefaultLayout: React.FunctionComponent = ({ children }) => {
   return (
      <>
         <Navbar />
         <main>{children}</main>
      </>
   );
};

export default DefaultLayout;
