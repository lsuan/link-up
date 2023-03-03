import { useAtom } from "jotai";
import { FiMenu, FiX } from "react-icons/fi";
import { type MenuOpenAtom } from "./Navbar";

function MobileNavbar({ menuOpen }: { menuOpen: MenuOpenAtom }) {
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpen);

  return (
    <button
      className="block text-2xl text-blue-500 transition-colors hover:text-blue-300 sm:hidden"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? <FiX /> : <FiMenu />}
    </button>
  );
}

export default MobileNavbar;
