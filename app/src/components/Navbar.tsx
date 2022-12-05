import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data } = useSession();

  return (
    <nav className="dark-puple flex justify-between">
      <Link href="/">
        <h1 className="text-5xl">Link Up!</h1>
      </Link>

      {/* TODO: Add admin view */}
      <ul className="action-btns flex items-center justify-around gap-8">
        <li className="text-indigo-400/75 hover:text-indigo-500/75">
          <a onClick={() => signIn()}>Login</a>
        </li>
        <li className="text-indigo-400/75 hover:text-indigo-500/75">
          <Link href="/register">Register</Link>
        </li>

        {/* TODO: Only allow these for admin view */}
        <li>
          <Link href="/dashboard">My Dashboard</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        {data && (
          <li>
            <a onClick={() => signOut()}>Logout</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
