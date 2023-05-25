import Typography from "@ui/Typography";
import { useEffect, useRef, useState } from "react";
import {
  parseRange,
  type AvailabilityStatus,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import { getShortenedDateWithDay } from "../../utils/timeUtils";

interface PopupPosition {
  vertical: string;
  horizontal: string;
  translate: string;
}

function AvailabilityCellPopUp({
  timeKey,
  available,
  unavailable,
  clientX,
}: AvailabilityStatus) {
  const popupRef = useRef<HTMLDivElement>(null);
  const dateString = timeKey.split(":")[0] as string;
  const [startTime, endTime] = parseRange(timeKey) as [string, string];
  const [start, end] = getFormattedHours(
    [Number(startTime), Number(endTime)],
    "long"
  );
  const [positions, setPositions] = useState<PopupPosition>();

  useEffect(() => {
    if (!popupRef) {
      return;
    }
    const popup = popupRef.current as HTMLDivElement;

    const currentPositions = {
      vertical: "top-4",
      horizontal: "-left-40",
      translate: "-translate-y-4",
    };
    const container = document.querySelector(
      ".availability-container"
    ) as HTMLDivElement;
    const grid = document.getElementById("availability-responses-grid");
    const gridHeight = grid?.scrollHeight as number;
    const parentOffsetTop = popup.parentElement?.offsetTop as number;
    const containerWidth = container?.clientWidth as number;
    const containerPaddingX = 64;
    const timeLabelsWidth = 60;
    const popupWidth = popup.clientWidth as number;
    const popupHeight = popup.clientHeight as number;
    const cellWidth = 80;
    const topOverflow = parentOffsetTop + popupHeight;
    const borderOffset = 2; // a pixel per cell

    // if container is too small
    if (containerWidth - timeLabelsWidth - containerPaddingX < 160) {
      currentPositions.vertical =
        topOverflow > gridHeight ? "bottom-full" : "top-full";
      currentPositions.horizontal =
        clientX < (containerWidth + containerPaddingX) / 2
          ? "left-0"
          : "right-0";
      currentPositions.translate = "";
      setPositions({ ...currentPositions });
      return;
    }

    if (
      clientX - popupWidth - cellWidth / 2 - timeLabelsWidth - borderOffset <=
      0
    ) {
      currentPositions.horizontal = "-right-40";
    }
    if (topOverflow > gridHeight) {
      currentPositions.vertical = "bottom-4";
      currentPositions.translate = "translate-y-4";
    }

    setPositions({ ...currentPositions });
  }, [clientX, popupRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute z-20 flex w-40 flex-col gap-2 break-words rounded-lg border border-neutral-900 bg-white p-2 text-xs transition-all${
        positions
          ? ` ${positions.horizontal} ${positions.vertical} ${positions.translate}`
          : ""
      }`}
    >
      <header className="font-semibold">
        <Typography intent="h4">
          {`${getShortenedDateWithDay(new Date(dateString))} ${start} — ${end}`}
        </Typography>
      </header>
      <div className="flex flex-col gap-0">
        <Typography>
          <span className="font-semibold text-indigo-300">Available</span>
          {` (${available.length}): ${available.join(", ")}`}
        </Typography>
        {unavailable?.length > 0 && (
          <Typography>
            <span className="font-semibold text-indigo-500">Unavailable</span>
            {` (${unavailable.length}): ${unavailable.join(", ")}`}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default AvailabilityCellPopUp;
