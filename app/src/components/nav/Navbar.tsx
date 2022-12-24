import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import Link from "next/link";

export const menuOpen = atom(false);

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpen);

  return (
    <nav className="dark-puple flex justify-between border-b-2 border-b-gray-500 bg-neutral-900 px-8 py-4 text-white">
      <Link href="/" onClick={() => setIsMenuOpen(false)}>
        <div className="text-3xl">Link Up!</div>
      </Link>

      <button
        className="text-2xl text-blue-500 hover:text-blue-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <FontAwesomeIcon icon={faClose} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </button>
    </nav>
  );
}

export default Navbar;
