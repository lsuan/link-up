import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PublishSection() {
  return (
    <div className="my-8 w-full px-8">
      <h3 className="mb-4 text-3xl font-semibold">
        Ready to finalize dates and times?
      </h3>
      <button className="w-full rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black">
        <FontAwesomeIcon icon={faListCheck} className="mr-2" />
        Publish Event(s)
      </button>
    </div>
  );
}

export default PublishSection;
