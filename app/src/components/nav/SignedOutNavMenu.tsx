import MobileNavMenuItem from "./MobileNavMenuItem";

function SignedOutNavMenu() {
  return (
    <ul className="flex h-full w-full flex-col items-center bg-neutral-900 text-xl">
      <MobileNavMenuItem href="/login" name="Log In" className="pt-0" />
      <MobileNavMenuItem href="/signup" name="Sign Up" />
      <MobileNavMenuItem href="/" name="About" />
      <MobileNavMenuItem href="/" name="Contact Us" className="border-b-0" />
    </ul>
  );
}

export default SignedOutNavMenu;
