import { useAtom } from "jotai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import MobileNavMenuItem from "./MobileNavMenuItem";
import { menuOpen } from "./Navbar";

function SignedInNavMenu() {
  const router = useRouter();
  const [, setIsMenuOpen] = useAtom(menuOpen);
  const handleSignOut = async () => {
    const data = await signOut({ callbackUrl: "/", redirect: false });
    router.push(data.url);
    setIsMenuOpen(false);
  };
  return (
    <ul className="absolute left-0 top-0 z-[999] flex h-full w-full flex-col items-center bg-neutral-900 px-8 text-xl">
      <MobileNavMenuItem href="/dashboard" name="My Dashboard" />
      <MobileNavMenuItem href="/settings" name="Settings" />
      <MobileNavMenuItem href="/" name="About" />
      <MobileNavMenuItem href="/" name="Contact Us" />
      <MobileNavMenuItem
        href=""
        name="Sign Out"
        className="border-b-0"
        onClick={() => handleSignOut()}
      />
    </ul>
  );
}

export default SignedInNavMenu;
