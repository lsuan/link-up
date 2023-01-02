import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function BackArrow({ href, page }: { href: string; page: string }) {
  return (
    <div className="-mt-2 mb-4 text-sm">
      <Link href={href} className="group text-blue-500 hover:text-blue-300">
        <FontAwesomeIcon
          className="mr-2 transition-all group-hover:mr-4"
          icon={faArrowLeftLong}
        />
        <span className="transition-colors">{`Back to ${page}`}</span>
      </Link>
    </div>
  );
}

export default BackArrow;
