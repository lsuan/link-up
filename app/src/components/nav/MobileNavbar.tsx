import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { type MenuOpenAtom } from "./Navbar";

function MobileNavbar({ menuOpen }: { menuOpen: MenuOpenAtom }) {
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpen);

  return (
    <button
      className="block text-2xl text-blue-500 transition-colors hover:text-blue-300 sm:hidden"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? (
        <FontAwesomeIcon icon={faClose} />
      ) : (
        <FontAwesomeIcon icon={faBars} />
      )}
    </button>
  );
}

export default MobileNavbar;
