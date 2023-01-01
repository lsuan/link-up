import {
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Event = {
  scheduleName: string;
  name?: string;
  date?: Date;
  start?: number;
  end?: number;
  location?: string;
  description?: string;
};

function EventCard({
  scheduleName,
  name,
  date,
  start,
  end,
  location,
  description,
}: Event) {
  const convertDate = (date: Date | undefined) => {
    return date
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "2-digit",
          month: "2-digit",
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
    <div className="flex flex-col gap-4 rounded-xl bg-neutral-700 p-6">
      <h3 className="text-xl">{`${scheduleName}${name ? `: ${name}` : ""}`}</h3>
      <ul className="flex flex-col gap-2">
        <li className="flex gap-2">
          <div className="w-4 text-center">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <p>{`${convertDate(date)} ${
            start && end
              ? `| ${convertTime(start, "America/Los_Angeles")} — ${convertTime(
                  end,
                  "America/Los_Angeles"
                )}`
              : ""
          }`}</p>
        </li>
        <li className="flex gap-2">
          <div className="w-4 text-center">
            <FontAwesomeIcon icon={faLocationPin} />
          </div>
          <p>{location || "TBD"}</p>
        </li>
        {description && (
          <li className="flex gap-2">
            <div className="w-4 text-center">
              <FontAwesomeIcon icon={faNoteSticky} />
            </div>
            <p className="line-clamp-2">{description}</p>
          </li>
        )}
      </ul>
      <Link
        href={"/schedule"}
        className="w-full rounded-lg bg-neutral-500 p-2 text-center text-white hover:bg-neutral-300 hover:text-black"
      >
        View
      </Link>
    </div>
  );
}

export default EventCard;
