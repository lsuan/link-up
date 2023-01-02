import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function PublishSection() {
  return (
    <div className="my-8 w-full px-8">
      <h3 className="mb-4 text-3xl font-semibold">
        Ready to finalize dates and times?
      </h3>
      <button className="w-full rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black">
        <Link href="/schedule/publish">
          <FontAwesomeIcon icon={faListCheck} className="mr-2" />
          Publish Event(s)
        </Link>
      </button>
    </div>
  );
}

export default PublishSection;
