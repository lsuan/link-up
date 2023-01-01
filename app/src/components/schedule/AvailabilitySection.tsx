import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AvailabilitySection() {
  return (
    <div className="my-8 w-full bg-neutral-500 py-8 px-8">
      <h2 className="mb-8 rounded-lg text-3xl font-semibold">Availability</h2>
      <button className="w-full rounded-lg border border-white bg-neutral-900 p-2 transition-colors hover:bg-neutral-700">
        <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
        Add/Edit Availability
      </button>
    </div>
  );
}

export default AvailabilitySection;
