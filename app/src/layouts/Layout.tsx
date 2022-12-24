import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Navbar, { menuOpen } from "../components/nav/Navbar";
import SignedInNavMenu from "../components/nav/SignedInNavMenu";
import SignedOutNavMenu from "../components/nav/SignedOutNavMenu";

function Layout({ children }: any) {
  const [isMenuOpen] = useAtom(menuOpen);
  const { status } = useSession();
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-neutral-900 p-8 text-white">
        {isMenuOpen ? (
          status === "unauthenticated" ? (
            <SignedOutNavMenu />
          ) : (
            <SignedInNavMenu />
          )
        ) : (
          children
        )}
      </main>
    </>
  );
}

export default Layout;
