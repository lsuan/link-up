import {
  faArrowRightLong,
  faClock,
  faLocationPin,
  faNoteSticky,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Event } from "@prisma/client";
import Button from "@ui/Button";
import { createSlug } from "../../utils/scheduleUtils";
import { getEventCardDateDisplay } from "../../utils/timeUtils";

type EventCardProps = {
  scheduleName: string;
  host: string;
} & Event;

function DashboardEventCard({
  scheduleId,
  scheduleName,
  name,
  date,
  startTime,
  endTime,
  location,
  description,
  host,
}: EventCardProps) {
  const slug = createSlug(scheduleName, scheduleId) ?? "";

  // TODO: figure out how to convert time by location
  return (
    <div
      className={`flex flex-col rounded-xl bg-neutral-700 p-4 ${
        scheduleName ? "gap-4" : "gap-2"
      }`}
    >
      <header className="relative flex items-start justify-between gap-2">
        <h3 className="w-9/12 text-lg">{`${scheduleName}: ${name}`}</h3>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px] w-[14px]" icon={faUser} />
          <p>{host}</p>
        </li>
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px]" icon={faClock} />
          <p className="break-words">
            {`${getEventCardDateDisplay(date)} | ${startTime} — ${endTime}`}
          </p>
        </li>
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px] w-[14px]" icon={faLocationPin} />
          <p>{location || "TBD"}</p>
        </li>
        {description && (
          <li className="flex items-start gap-2">
            <FontAwesomeIcon
              className="mt-[3px] w-[14px]"
              icon={faNoteSticky}
            />
            <p className={scheduleName ? "line-clamp-2" : ""}>{description}</p>
          </li>
        )}
      </ul>

      <Button href={`/schedule/${slug}`}>
        View
        <FontAwesomeIcon
          icon={faArrowRightLong}
          className="transition-transform group-hover:translate-x-2"
        />
      </Button>
    </div>
  );
}

export default DashboardEventCard;
