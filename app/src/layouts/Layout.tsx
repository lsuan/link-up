import Navbar from "../components/Navbar";

function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default Layout;
