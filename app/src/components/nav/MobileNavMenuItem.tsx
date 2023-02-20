import { useAtom } from "jotai";
import Link from "next/link";
import { menuOpen } from "./Navbar";

function MobileNavMenuItem({
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
      className={`flex w-full border-b border-b-gray-500 text-center text-blue-500 hover:text-blue-300 ${className} transition-colors`}
    >
      <Link
        href={href}
        onClick={() => {
          setIsMenuOpen(false);
          onClick;
        }}
        className="h-full w-full p-6"
      >
        {name}
      </Link>
    </li>
  );
}

export default MobileNavMenuItem;
