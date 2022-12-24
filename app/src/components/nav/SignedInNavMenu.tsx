import { signOut } from "next-auth/react";
import NavMenuItem from "./NavMenuItem";

function SignedInNavMenu() {
  return (
    <ul className="flex h-full w-full flex-col items-center bg-neutral-900 text-xl">
      <NavMenuItem href="/dashboard" name="My Dashboard" />
      <NavMenuItem href="/dashboard" name="Settings" />
      <NavMenuItem
        href=""
        name="Sign Out"
        className="border-b-0"
        onClick={() => signOut({ callbackUrl: "/" })}
      />
    </ul>
  );
}

export default SignedInNavMenu;
