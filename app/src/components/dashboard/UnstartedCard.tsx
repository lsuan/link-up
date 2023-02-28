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
import CardListItem from "../shared/CardListItem";

type UnstartedProps = {
  id: string;
  name: string;
  description?: string | null;
  host: string;
};

function UnstartedCard({ id, name, description, host }: UnstartedProps) {
  const slug = createSlug(name, id) ?? "";

  // TODO: figure out how to convert time by location
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-neutral-700 p-4">
      <header className="relative flex items-start justify-between gap-2">
        <Typography intent="h3">{name}</Typography>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <CardListItem text={host}>
          <FiUser />
        </CardListItem>
        <CardListItem text={host}>
          <FiClock />
        </CardListItem>
        <CardListItem text={host}>
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

export default UnstartedCard;
