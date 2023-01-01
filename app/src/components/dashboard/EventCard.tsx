import {
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Event = {
  scheduleName?: string;
  name?: string;
  date?: Date;
  start?: number;
  end?: number;
  location?: string;
  description?: string;
  className?: string;
};

function EventCard({
  scheduleName,
  name,
  date,
  start,
  end,
  location,
  description,
  className,
}: Event) {
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
      <h3 className="text-lg">{`${scheduleName || ""}${
        scheduleName && name ? ": " : ""
      }${name || ""}`}</h3>
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
            <FontAwesomeIcon className="mt-[3px]" icon={faNoteSticky} />
            <p className={scheduleName ? "line-clamp-2" : ""}>{description}</p>
          </li>
        )}
      </ul>
      {scheduleName && (
        <Link
          href={"/schedule"}
          className="w-full rounded-lg bg-neutral-500 p-2 text-center text-white hover:bg-neutral-300 hover:text-black"
        >
          View
        </Link>
      )}
    </div>
  );
}

export default EventCard;
