import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function BackArrow() {
  return (
    <div className="-mt-2 mb-4 text-sm">
      <Link href="/dashboard" className="text-blue-500 hover:text-blue-300">
        <FontAwesomeIcon className="mr-1" icon={faArrowLeft} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default BackArrow;
