import {
  faArrowRightLong,
  faCalendarPlus,
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { createSlug } from "../../utils/scheduleSlug";

type Event = {
  // scheduleId: string;
  scheduleName?: string;
  name?: string;
  date?: Date;
  start?: number;
  end?: number;
  location?: string;
  description?: string | null;
  className?: string;
};

export const addToCalendarModal = atom(false);

function EventCard({
  // scheduleId,
  scheduleName,
  name,
  date,
  start,
  end,
  location,
  description,
  className,
}: Event) {
  const [, setIsAddToCalendarModalShown] = useAtom(addToCalendarModal);
  // const slug = createSlug(scheduleName || "", scheduleId);
  const router = useRouter();
  console.log(router.pathname);

  const convertDate = (date: Date | undefined) => {
    return date
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(date)
      : "TBD";
  };
  const convertTime = (time: number, timeZone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: timeZone,
      timeZoneName: "short",
    }).format(new Date(time * 1000));
  };

  // TODO: figure out how to convert time by location
  return (
    <div
      className={`flex flex-col rounded-xl bg-neutral-700 p-4 ${
        scheduleName ? "gap-4" : "gap-2"
      } ${className || ""}`}
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
          <p>{`${convertDate(date)} ${
            start && end
              ? `| ${convertTime(start, "America/Los_Angeles")} — ${convertTime(
                  end,
                  "America/Los_Angeles"
                )}`
              : ""
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
