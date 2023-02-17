import Link from "next/link";

function NavbarItem({
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
  return (
    <li className={`hover:text-blue-300${className ? ` ${className}` : ""}`}>
      <Link onClick={onClick} href={href}>
        {name}
      </Link>
    </li>
  );
}

export default NavbarItem;
