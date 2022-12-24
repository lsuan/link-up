import NavMenuItem from "./NavMenuItem";

function SignedOutNavMenu() {
  return (
    <ul className="flex h-full w-full flex-col items-center bg-neutral-900 text-xl">
      <NavMenuItem href="/login" name="Log In" className="pt-0" />
      <NavMenuItem href="/signup" name="Sign Up" />
      <NavMenuItem href="/" name="About" />
      <NavMenuItem href="/" name="Contact Us" className="border-b-0" />
    </ul>
  );
}

export default SignedOutNavMenu;
