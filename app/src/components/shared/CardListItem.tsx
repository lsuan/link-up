import Typography from "@ui/Typography";
import { FiBookmark, FiClock, FiMapPin, FiUser } from "react-icons/fi";

type CardListItemProps = {
  text: string;
  icon: CardListIcon;
};

type CardListIcon = "user" | "clock" | "pin" | "bookmark";

const icons = {
  user: <FiUser size="1rem" />,
  clock: <FiClock size="1rem" />,
  pin: <FiMapPin size="1rem" />,
  bookmark: <FiBookmark size="1rem" />,
};

function CardListItem({ text, icon }: CardListItemProps) {
  return (
    <li className="flex items-center gap-2">
      <span>{icons[icon as keyof typeof icons]}</span>
      <Typography>{text}</Typography>
    </li>
  );
}

export default CardListItem;
