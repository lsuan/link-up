import { FiEdit, FiTrash2 } from "react-icons/fi";
import { type InitialEventInfo } from "../../../pages/schedule/[slug]/publish";
import { type UserAvailability } from "../../../utils/availabilityUtils";
import CardListItem from "../../shared/CardListItem";
import PublishCardMetadata from "./PublishCardMetadata";

function PublishEventCard({
  index,
  events,
  setEvents,
  attendees,
  isDeleteWarningModalShown,
  setIsDeleteWarningModalShown,
}: {
  index: number;
  events: InitialEventInfo[];
  setEvents: (events: InitialEventInfo[]) => void;
  attendees: UserAvailability[];
  isDeleteWarningModalShown: boolean[];
  setIsDeleteWarningModalShown: (state: boolean[]) => void;
}) {
  const event = events[index] as InitialEventInfo;
  const setCardEditState = () => {
    const eventData: InitialEventInfo = { ...event, isEditing: true };
    const prevEvents = events.slice();
    prevEvents[index] = eventData;
    setEvents([...prevEvents]);
  };
  const handleModalShow = () => {
    const prev = isDeleteWarningModalShown.slice(0, index);
    const rest = isDeleteWarningModalShown.slice(index + 1);
    setIsDeleteWarningModalShown([...prev, true, ...rest]);
  };

  return (
    <section className="w-full rounded-lg bg-neutral-300 p-6">
      <header className="relative">
        <p className="text-sm">
          {event.date &&
            Intl.DateTimeFormat("en-us", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(event.date)}
        </p>
        <div className="absolute right-0 top-0 flex gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500  text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
            onClick={() => handleModalShow()}
          >
            <FiTrash2 />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
            onClick={() => setCardEditState()}
          >
            <FiEdit />
          </button>
        </div>
      </header>
      <h4 className="my-4 text-xl font-semibold">{event.name}</h4>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs">Start Time</span>
          <p className="font-semibold">{event.startTime}</p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-xs">End Time</span>
          <p className="font-semibold">{event.endTime}</p>
        </div>
      </div>
      {event.date && (
        <PublishCardMetadata
          attendees={attendees}
          date={event.date}
          startTime={event.startTime}
          endTime={event.endTime}
        />
      )}
      <ul>
        <CardListItem
          text={
            event.location && event.location !== ""
              ? event.location
              : "Add a location..."
          }
          icon="pin"
        />
        <CardListItem
          text={
            event.description && event.description !== ""
              ? event.description
              : "Add a description..."
          }
          icon="bookmark"
        />
      </ul>
    </section>
  );
}

export default PublishEventCard;
