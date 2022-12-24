import { useAtom } from "jotai";
import Link from "next/link";
import { menuOpen } from "./Navbar";

function NavMenuItem({
  href,
  name,
  className,
  onClick,
}: {
  href: string;
  name: string;
  className?: string;
  onClick?: () => void;
}) {
  const [, setIsMenuOpen] = useAtom(menuOpen);
  return (
    <li
      className={`w-full border-b border-b-gray-500 p-6 text-center ${className}`}
    >
      <Link
        href={href}
        onClick={onClick ? onClick : () => setIsMenuOpen(false)}
      >
        {name}
      </Link>
    </li>
  );
}

export default NavMenuItem;
