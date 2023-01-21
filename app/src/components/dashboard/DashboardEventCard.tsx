import {
  faArrowRightLong,
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { createSlug } from "../../utils/scheduleSlugUtils";
import { trpc } from "../../utils/trpc";

export type EventCard = {
  index?: number;
  cachedScheduleName?: string;
} & Event;

type EventCardProps = {
  upcoming: EventCard[];
} & EventCard;

function DashboardEventCard({
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
  const [scheduleName, setScheduleName] = useState<string>(
    cachedScheduleName ?? ""
  );
  const schedule = trpc.schedule.getScheduleNameById.useQuery(scheduleId, {
    onSuccess: (data) => onScheduleSuccess(data?.name as string),
    refetchOnWindowFocus: false,
    enabled: cachedScheduleName === undefined,
  });

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
        <h3 className="w-9/12 text-lg">{`${scheduleName}: ${name}`}</h3>
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

      <Link
        href={`/schedule/${createSlug(scheduleName, scheduleId)}`}
        className="group w-full rounded-lg bg-neutral-500 p-2 text-center text-white transition-all hover:bg-neutral-300 hover:text-black"
      >
        View
        <FontAwesomeIcon
          icon={faArrowRightLong}
          className="ml-2 transition-transform group-hover:translate-x-2"
        />
      </Link>
    </div>
  );
}

export default DashboardEventCard;
