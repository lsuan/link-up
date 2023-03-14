/* eslint-disable max-len */
import { useEffect, useRef, useState, type ReactNode } from "react";
import Typography from "./Typography";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  const [isShown, setIsShown] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isShown) {
      return;
    }
    const textElement = textRef.current;
    if (!textElement) {
      return;
    }
    const { x: textClientX } = textElement.getBoundingClientRect();

    if (textClientX + textElement.clientWidth / 2 > document.body.offsetWidth) {
      textElement.classList.toggle("right-0");
    } else if (
      textClientX - textElement.clientWidth / 2 <
      document.body.offsetLeft
    ) {
      textElement.classList.toggle("left-0");
    } else {
      textElement.classList.toggle("left-1/2");
      textElement.classList.toggle("-translate-x-1/2");
    }
  }, [isShown]);

  return (
    <div
      className="relative cursor-pointer"
      onMouseOver={() => setIsShown(true)}
      onFocus={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {isShown && (
        <div
          className="absolute bottom-5 z-50 w-60 cursor-default rounded border border-neutral-500 bg-white p-2"
          ref={textRef}
        >
          <Typography className="text-sm">{text}</Typography>
        </div>
      )}
      {children}
    </div>
  );
}

export default Tooltip;
