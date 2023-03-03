import { type Event } from "@prisma/client";
import Button from "@ui/Button";
import Typography from "@ui/Typography";
import { FiChevronsRight } from "react-icons/fi";
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
      className={`flex flex-col rounded-xl bg-neutral-300 p-4 ${
        scheduleName ? "gap-4" : "gap-2"
      }`}
    >
      <header className="relative flex items-start justify-between gap-2">
        <Typography intent="h3">{`${scheduleName}: ${name}`}</Typography>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <CardListItem text={host} icon="user" />
        <CardListItem
          text={`${getEventCardDateDisplay(date)} | ${startTime} — ${endTime}`}
          icon="clock"
        />
        <CardListItem text={location || "TBD"} icon="pin" />
        {description && <CardListItem text={description} icon="bookmark" />}
      </ul>

      <Button href={`/schedule/${slug}`}>
        View
        <FiChevronsRight className="transition-transform group-hover:translate-x-2" />
      </Button>
    </div>
  );
}

export default DashboardEventCard;
