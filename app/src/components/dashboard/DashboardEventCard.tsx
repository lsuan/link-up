import { type Event } from "@prisma/client";
import Button from "@ui/Button";
import Typography from "@ui/Typography";
import {
  FiBookmark,
  FiChevronsRight,
  FiClock,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { createSlug } from "../../utils/scheduleUtils";
import { getEventCardDateDisplay } from "../../utils/timeUtils";
import CardListItem from "../shared/CardListItem";

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
        <Typography intent="h3">{`${scheduleName}: ${name}`}</Typography>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <CardListItem text={host}>
          <FiUser />
        </CardListItem>
        <CardListItem
          text={`${getEventCardDateDisplay(date)} | ${startTime} — ${endTime}`}
        >
          <FiClock />
        </CardListItem>
        <CardListItem text={location || "TBD"}>
          <FiMapPin />
        </CardListItem>
        {description && (
          <CardListItem text={description}>
            <FiBookmark />
          </CardListItem>
        )}
      </ul>

      <Button href={`/schedule/${slug}`}>
        View
        <FiChevronsRight className="transition-transform group-hover:translate-x-2" />
      </Button>
    </div>
  );
}

export default DashboardEventCard;
