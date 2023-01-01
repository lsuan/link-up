import { atom, useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import NavbarItem from "./NavbarItem";

export const menuOpen = atom(false);

function Navbar() {
  const [, setIsMenuOpen] = useAtom(menuOpen);
  const { status } = useSession();

  return (
    <nav className="dark-puple flex justify-between border-b-2 border-b-gray-500 bg-neutral-900 px-8 py-4 text-white">
      <Link href="/" onClick={() => setIsMenuOpen(false)}>
        <div className="text-3xl">Link Up!</div>
      </Link>
      <MobileNavbar />

      <ul className="hidden items-center justify-between gap-8 text-lg text-blue-500 sm:flex">
        {status !== "authenticated" ? (
          <>
            <NavbarItem href="/" name="About" />
            <NavbarItem href="/" name="Contact Us" />
            <NavbarItem href="/login" name="Log In" />
            <NavbarItem href="/signup" name="Sign Up" />
          </>
        ) : (
          <>
            <NavbarItem href="/dashboard" name="My Dashboard" />
            <NavbarItem href="/settings" name="Settings" />
            <NavbarItem
              href="/"
              name="Sign Out"
              onClick={() => signOut({ callbackUrl: "/" })}
            />
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
