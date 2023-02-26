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
      <p>{text}</p>
    </li>
  );
}

export default CardListItem;
