import { notice } from "@ui/Snackbar";
import { useAtom } from "jotai";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

function BackArrow({ href, page }: { href: string; page: string }) {
  const [, setNoticeMessage] = useAtom(notice);
  return (
    <div className="-mt-2 mb-4 text-sm">
      <Link
        href={href}
        className="group flex items-center gap-2 text-blue-500 hover:text-blue-300"
        onClick={() => setNoticeMessage("")}
      >
        <FiArrowLeft className="transition-all group-hover:mr-2" />
        <span className="transition-colors">{`Back to ${page}`}</span>
      </Link>
    </div>
  );
}

export default BackArrow;
