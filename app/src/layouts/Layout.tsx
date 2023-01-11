import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Navbar, { menuOpen } from "../components/nav/Navbar";
import SignedInNavMenu from "../components/nav/SignedInNavMenu";
import SignedOutNavMenu from "../components/nav/SignedOutNavMenu";

function Layout({ children }: any) {
  const [isMenuOpen] = useAtom(menuOpen);
  const { status } = useSession();
  return (
    <>
      <Head>
        <title key="title">LinkUp</title>
        <meta
          key="description"
          name="description"
          content="A scheduling website"
        />
        <meta key="author" name="author" content="Lee Suan, Lindsey Duong" />
        <link key="icon" rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="relative flex flex-col bg-neutral-900 py-8 text-white">
        <>
          {isMenuOpen &&
            (status === "authenticated" ? (
              <SignedInNavMenu />
            ) : (
              <SignedOutNavMenu />
            ))}
          {children}
        </>
      </main>
    </>
  );
}

export default Layout;
