import { faClose, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { menuOpen } from "./Navbar";

function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpen);

  return (
    <button
      className="block text-2xl text-blue-500 hover:text-blue-300 sm:hidden"
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
