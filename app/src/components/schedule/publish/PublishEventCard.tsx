import {
  faEdit,
  faLocationPin,
  faNoteSticky,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";
import { InitialEventInfo } from "../../../pages/schedule/[slug]/publish";

function PublishEventCard({
  index,
  isEditing,
  setIsEditing,
  event,
}: {
  index: number;
  isEditing: boolean[];
  setIsEditing: (state: boolean[]) => void;
  event: InitialEventInfo | Event;
}) {
  const setCardEditState = () => {
    const prevCards = isEditing.slice(0, index);
    const rest = isEditing.slice(index + 1);
    setIsEditing([...prevCards, true, ...rest]);
  };
  return (
    <section className="w-full rounded-lg bg-neutral-500 p-6">
      <header className="relative">
        <p className="text-sm">
          {Intl.DateTimeFormat("en-us", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }).format(event.date)}
        </p>
        <div className="absolute right-0 top-0 flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500  text-white transition-colors hover:bg-blue-300 hover:text-blue-700">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
            onClick={() => setCardEditState()}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </header>
      <h4 className="my-4 text-xl font-semibold">{event.name}</h4>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs">Start Time</label>
          <p className="font-semibold">{event.startTime}</p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <label className="text-xs">End Time</label>
          <p className="font-semibold">{event.endTime}</p>
        </div>
      </div>
      <ul className="mt-4">
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px] w-[14px]" icon={faLocationPin} />
          <p className="text-neutral-300">
            {event.location ?? "Add a location..."}
          </p>
        </li>
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px] w-[14px]" icon={faNoteSticky} />
          <p className="text-neutral-300">
            {event.description ?? "Add a description..."}
          </p>
        </li>
      </ul>
    </section>
  );
}

export default PublishEventCard;
