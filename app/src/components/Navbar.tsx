import Link from "next/link";

function Navbar() {
  return (
    <section className="dark-puple flex justify-between">
      <Link href="/">
        <h1 className="text-5xl">Link Up!</h1>
      </Link>

      {/* TODO: Add admin view */}
      <ul className="action-btns flex items-center justify-around gap-8">
        <li className="text-indigo-400/75 hover:text-indigo-500/75">
          <Link href="/login">Login</Link>
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
      </ul>
    </section>
  );
}

export default Navbar;
