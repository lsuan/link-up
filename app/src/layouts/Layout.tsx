import Snackbar from "@ui/Snackbar";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { type ReactNode } from "react";
import Navbar, { menuOpen } from "../components/nav/Navbar";
import SignedInNavMenu from "../components/nav/SignedInNavMenu";
import SignedOutNavMenu from "../components/nav/SignedOutNavMenu";

type LayoutProps = {
  children: ReactNode;
  rest?: unknown;
};
function Layout({ children }: LayoutProps) {
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
      <main className="relative my-auto flex h-full flex-col bg-white py-8 text-black">
        {isMenuOpen &&
          (status === "authenticated" ? (
            <SignedInNavMenu />
          ) : (
            <SignedOutNavMenu />
          ))}
        {children}
        <Snackbar />
      </main>
    </>
  );
}

export default Layout;
