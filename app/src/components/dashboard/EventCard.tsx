import {
  faArrowRightLong,
  faCalendarPlus,
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

export const addToCalendarModal = atom(false);

type EventCard = {
  index?: number;
  cachedScheduleName?: string;
} & Event;

type EventCardProps = {
  upcoming: EventCard[];
} & EventCard;

function EventCard({
  index,
  scheduleId,
  cachedScheduleName,
  name,
  date,
  startTime,
  endTime,
  location,
  description,
  upcoming,
}: EventCardProps) {
  const [, setIsAddToCalendarModalShown] = useAtom(addToCalendarModal);
  const [scheduleName, setScheduleName] = useState<string>(
    cachedScheduleName ?? ""
  );
  const schedule = trpc.schedule.getScheduleNameById.useQuery(scheduleId, {
    onSuccess: (data) => onScheduleSuccess(data?.name as string),
    refetchOnWindowFocus: false,
    enabled: cachedScheduleName === undefined,
  });
  const router = useRouter();

  const onScheduleSuccess = (name: string) => {
    setScheduleName(name);
    const eventIndex = index as number;
    const currentEvent = upcoming[eventIndex] as EventCard;
    const cachedEvent: EventCard = {
      ...currentEvent,
      cachedScheduleName: name,
    };
    upcoming.splice(eventIndex, 1, cachedEvent);
  };

  // TODO: figure out how to convert time by location
  return (
    <div
      className={`flex flex-col rounded-xl bg-neutral-700 p-4 ${
        scheduleName ? "gap-4" : "gap-2"
      }`}
    >
      <header className="relative flex items-start justify-between gap-2">
        <h3 className="w-9/12 text-lg">{`${scheduleName || ""}${
          scheduleName && name ? ": " : ""
        }${name || ""}`}</h3>
        {!scheduleName && (
          <button
            className="absolute right-0 flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
            onClick={() => setIsAddToCalendarModalShown(true)}
          >
            <FontAwesomeIcon icon={faCalendarPlus} className="w-full" />
          </button>
        )}
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px]" icon={faClock} />
          <p>{`${date} ${
            startTime && endTime ? `| ${startTime} — ${endTime}` : ""
          }`}</p>
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
      {scheduleName && (
        <Link
          href={`/schedule`}
          className="group w-full rounded-lg bg-neutral-500 p-2 text-center text-white transition-all hover:bg-neutral-300 hover:text-black"
        >
          View
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className="ml-2 transition-transform group-hover:translate-x-2"
          />
        </Link>
      )}
    </div>
  );
}

export default EventCard;
