import Typography from "@ui/Typography";
import { type ReactNode } from "react";

function CardListItem({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      {children}
      <Typography>{text}</Typography>
    </li>
  );
}

export default CardListItem;
