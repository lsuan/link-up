import {
  faCalendarPlus,
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";

export type ScheduleEventCardProps = {
  index: number;
  isAddToCalendarModalShown: boolean[];
  setIsAddToCalendarModalShown: (state: boolean[]) => void;
} & Event;

function ScheduleEventCard({
  name,
  date,
  startTime,
  endTime,
  location,
  description,
  index,
  isAddToCalendarModalShown,
  setIsAddToCalendarModalShown,
}: ScheduleEventCardProps) {
  const handleModalShow = () => {
    const prev = isAddToCalendarModalShown.slice(0, index);
    const rest = isAddToCalendarModalShown.slice(index + 1);
    setIsAddToCalendarModalShown([...prev, true, ...rest]);
  };

  // TODO: figure out how to convert time by location
  return (
    <div className="flex w-64 flex-col justify-between gap-4 rounded-xl bg-neutral-700 p-4">
      <section className="flex flex-col gap-4">
        <h3 className="w-9/12 text-lg">{name}</h3>

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-start gap-2">
            <FontAwesomeIcon className="mt-[3px]" icon={faClock} />
            <p>{`${date} ${
              startTime && endTime ? `| ${startTime} — ${endTime}` : ""
            }`}</p>
          </li>
          <li className="flex items-start gap-2">
            <FontAwesomeIcon
              className="mt-[3px] w-[14px]"
              icon={faLocationPin}
            />
            <p>{location || "TBD"}</p>
          </li>
          {description && (
            <li className="flex items-start gap-2">
              <FontAwesomeIcon
                className="mt-[3px] w-[14px]"
                icon={faNoteSticky}
              />
              <p>{description}</p>
            </li>
          )}
        </ul>
      </section>
      <button
        className="w-fill flex items-center justify-center gap-2 rounded-lg bg-neutral-500 p-2 text-white transition-colors hover:bg-neutral-300 hover:text-black"
        onClick={() => handleModalShow()}
      >
        <FontAwesomeIcon icon={faCalendarPlus} />
        Add To Calendar
      </button>
    </div>
  );
}

export default ScheduleEventCard;
