import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Schedule } from "@prisma/client";
import Link from "next/link";
import AvailabilityResponses from "./AvailabilityResponses";

export type AvailabilityProps = {
  schedule: Schedule;
  slug?: string;
  mode?: "read" | "write";
};

type SchedulePageAvailabilityProps = AvailabilityProps & {
  buttonTitle: string;
};

function AvailabilitySection({
  schedule,
  slug,
  buttonTitle,
}: SchedulePageAvailabilityProps) {
  return (
    <div className="my-8 w-full bg-neutral-500 py-8 px-8">
      <h2 className="mb-8 rounded-lg text-3xl font-semibold">Availability</h2>
      <AvailabilityResponses schedule={schedule} />
      <button className="flex w-full rounded-lg border border-white bg-neutral-900 p-2 transition-colors hover:bg-neutral-700">
        <Link href={`/schedule/${slug}/availability`} className="w-full">
          <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
          {buttonTitle}
        </Link>
      </button>
    </div>
  );
}

export default AvailabilitySection;
