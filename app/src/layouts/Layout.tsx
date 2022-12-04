import Navbar from "../components/Navbar";

function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col p-8">{children}</main>
    </>
  );
}

export default Layout;
