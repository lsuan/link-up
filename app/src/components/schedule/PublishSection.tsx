import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function PublishSection({ slug }: { slug: string }) {
  return (
    <div className="my-8 w-full px-8 text-center">
      <h3 className="mb-4 text-xl font-semibold">You've received responses!</h3>
      <h4 className="mb-2">Ready to finalize dates and times?</h4>
      <button className="flex w-full justify-center rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black">
        <Link className="w-full" href={`/schedule/${slug}/publish`}>
          <FontAwesomeIcon icon={faListCheck} className="mr-2" />
          Publish Event(s)
        </Link>
      </button>
    </div>
  );
}

export default PublishSection;
