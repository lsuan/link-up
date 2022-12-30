import { atom, useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";

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

      <ul className="hidden items-center justify-between gap-8 text-lg text-blue-500 hover:text-blue-300 sm:flex">
        {status !== "authenticated" ? (
          <>
            <li>
              <Link href="/">About</Link>
            </li>
            <li>
              <Link href="/">Contact Us</Link>
            </li>
            <li>
              <Link href="/login">Log In</Link>
            </li>
            <li>
              <Link href="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/dashboard">My Dashboard</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <Link href="" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
