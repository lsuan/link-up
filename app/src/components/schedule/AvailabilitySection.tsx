import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Schedule } from "@prisma/client";
import Link from "next/link";
import AvailabilityTable from "./AvailbilityTable";

export type AvailabilityProps = {
  schedule: Schedule;
};

function AvailabilitySection({ schedule }: AvailabilityProps) {
  return (
    <div className="my-8 w-full bg-neutral-500 py-8 px-8">
      <h2 className="mb-8 rounded-lg text-3xl font-semibold">Availability</h2>
      <AvailabilityTable schedule={schedule} />
      <button className="flex w-full rounded-lg border border-white bg-neutral-900 p-2 transition-colors hover:bg-neutral-700">
        <Link href="/schedule/availability" className="w-full">
          <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
          Add/Edit Availability
        </Link>
      </button>
    </div>
  );
}

export default AvailabilitySection;
