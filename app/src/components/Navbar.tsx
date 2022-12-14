import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data, status } = useSession();

  return (
    <nav className="dark-puple flex justify-between bg-neutral-900 p-4 text-white">
      <Link href="/">
        <div className="text-3xl">Link Up!</div>
      </Link>

      <ul className="action-btns flex items-center justify-around gap-8">
        {status === "unauthenticated" && (
          <>
            <li className="text-blue-300">
              {/* <a className="cursor-pointer" onClick={() => signIn()}>
                Login
              </a> */}
              <Link href="/login">Log In</Link>
            </li>
            <li className="text-blue-300">
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
