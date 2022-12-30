import { signOut } from "next-auth/react";
import MobileNavMenuItem from "./MobileNavMenuItem";

function SignedInNavMenu() {
  return (
    <ul className="flex h-full w-full flex-col items-center bg-neutral-900 text-xl">
      <MobileNavMenuItem href="/dashboard" name="My Dashboard" />
      <MobileNavMenuItem href="/settings" name="Settings" />
      <MobileNavMenuItem
        href=""
        name="Sign Out"
        className="border-b-0"
        onClick={() => signOut({ callbackUrl: "/" })}
      />
    </ul>
  );
}

export default SignedInNavMenu;
