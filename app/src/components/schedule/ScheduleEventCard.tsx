import { type Event } from "@prisma/client";
import { FiCalendar } from "react-icons/fi";
import { getEventCardDateDisplay } from "../../utils/timeUtils";
import CardListItem from "../shared/CardListItem";

export type ScheduleEventCardProps = {
  index: number;
  isAddToCalendarModalShown: boolean[];
  slug?: string;
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
    <div className="flex w-64 flex-col justify-between gap-4 rounded-xl bg-neutral-300 p-4">
      <section className="flex flex-col gap-4">
        <h3 className="w-9/12 text-lg">{name}</h3>

        <ul className="flex flex-col gap-2 text-sm">
          <CardListItem
            text={`${getEventCardDateDisplay(date)} ${
              startTime && endTime ? `| ${startTime} — ${endTime}` : ""
            }`}
            icon="clock"
          />
          {location && <CardListItem text={location || "TBD"} icon="pin" />}
          {description && (
            <CardListItem text={description || "TBD"} icon="bookmark" />
          )}
        </ul>
      </section>
      <button
        className="w-fill flex items-center justify-center gap-2 rounded-lg bg-neutral-500 p-2 text-white transition-colors hover:bg-neutral-300 hover:text-black"
        onClick={() => handleModalShow()}
      >
        <FiCalendar />
        Add To Calendar
      </button>
    </div>
  );
}

export default ScheduleEventCard;
