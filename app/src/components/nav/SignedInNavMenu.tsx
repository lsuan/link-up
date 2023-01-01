import { signOut } from "next-auth/react";
import MobileNavMenuItem from "./MobileNavMenuItem";

function SignedInNavMenu() {
  return (
    <ul className="absolute left-0 z-50 flex h-full w-full flex-col items-center bg-neutral-900 px-8 text-xl">
      <MobileNavMenuItem href="/dashboard" name="My Dashboard" />
      <MobileNavMenuItem href="/settings" name="Settings" />
      <MobileNavMenuItem href="/" name="About" />
      <MobileNavMenuItem href="/" name="Contact Us" />
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
