import Navbar from "../components/Navbar";

function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-neutral-900 p-8 text-white">
        {children}
      </main>
    </>
  );
}

export default Layout;
