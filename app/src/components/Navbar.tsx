import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function Navbar() {
  console.log("in navbar");
  const { data, status } = useSession();

  return (
    <nav className="dark-puple flex justify-between">
      <Link href="/">
        <h1 className="text-5xl">Link Up!</h1>
      </Link>

      <ul className="action-btns flex items-center justify-around gap-8">
        {status === "unauthenticated" && (
          <>
            <li className="text-indigo-400/75 hover:text-indigo-500/75">
              <a className="cursor-pointer" onClick={() => signIn()}>
                Login
              </a>
            </li>
            <li className="text-indigo-400/75 hover:text-indigo-500/75">
              <Link href="/register">Register</Link>
            </li>
          </>
        )}

        {data?.user && (
          <>
            {" "}
            <li>
              <Link href="/dashboard">My Dashboard</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <a
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
