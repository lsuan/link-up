import Typography from "@ui/Typography";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  categorizeUsers,
  getCellColor,
  getMostUsers,
  parseRange,
  setColors,
  type UserAvailability,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import { getShortenedDateWithDay } from "../../utils/timeUtils";

type AvailabilityStatus = {
  timeKey: string;
  available: string[];
  unavailable: string[];
  clientX: number;
};

type PopupPosition = {
  vertical: string;
  horizontal: string;
  translate: string;
};

function AvailabilityPopUp({
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

const AvailabilityGridReadCell = memo(
  ({
    attendees,
    allUsers,
    dates,
    date,
    dateIndex,
    hours,
    hour,
    hourIndex,
  }: {
    attendees: UserAvailability[];
    allUsers: string[];
    dates: Date[];
    date: Date;
    dateIndex: number;
    hours: number[];
    hour: number;
    hourIndex: number;
  }) => {
    const [status, setStatus] = useState<AvailabilityStatus>();
    const categorizedUsers = useMemo(
      () => categorizeUsers(attendees),
      [attendees]
    );
    const mostUsers = useMemo(
      () => getMostUsers(categorizedUsers),
      [categorizedUsers]
    );

    const getUsers = useCallback(
      (currentDate: Date, currentHour: string) => {
        if (!categorizedUsers) {
          return;
        }
        const formattedDate = currentDate.toISOString().split("T")[0];
        const timeKey = `${formattedDate}:${currentHour}`;
        return categorizedUsers.get(timeKey);
      },
      [categorizedUsers]
    );

    const setUsersByTime = (
      currentDate: Date,
      currentHour: string,
      availabilityStatus: AvailabilityStatus
    ) => {
      const users = getUsers(currentDate, currentHour);
      if (!users) {
        return;
      }
      const unavailableUsers = allUsers.filter(
        (user) => !users?.includes(user)
      );
      const formattedDate = currentDate.toISOString().split("T")[0];
      const timeKey = `${formattedDate}:${currentHour}`;
      const updatedAvailabilityStatus = {
        ...availabilityStatus,
        timeKey,
        available: users,
        unavailable: unavailableUsers,
      };

      setStatus(
        updatedAvailabilityStatus?.available.length !== 0
          ? updatedAvailabilityStatus
          : undefined
      );
    };

    const onMouseOver = (
      e: React.MouseEvent,
      currentDate: Date,
      currentHour: string
    ) => {
      const availabilityStatus: AvailabilityStatus = {
        timeKey: "",
        available: [],
        unavailable: [],
        clientX: e.clientX,
      };

      setUsersByTime(currentDate, currentHour, availabilityStatus);
    };

    const users = useMemo(
      () => getUsers(date, `${hour}-${hour + 0.5}`)?.length,
      [date, hour, getUsers]
    );
    const colors = useMemo(() => setColors(mostUsers), [mostUsers]);

    const cellColor = useMemo(
      () => getCellColor(users ?? 0, mostUsers, colors),
      [mostUsers, colors, users]
    );

    // TODO: fix styling for long words
    return (
      <section className="relative">
        {status && status.available.length !== 0 && (
          <AvailabilityPopUp {...status} />
        )}
        <div
          data-time={`${hour}-${hour + 0.5}`}
          className={`h-10 w-20 transition-all ${
            dateIndex !== dates.length - 1 ? "border-r" : ""
          } ${
            hourIndex !== hours.length - 1
              ? "border-b border-b-neutral-100"
              : ""
          } ${users ? `cursor-pointer ${cellColor}` : ""}`}
          onPointerOver={(e) =>
            users && onMouseOver(e, date, `${hour}-${hour + 0.5}`)
          }
          onFocus={(e) => e} // TODO: include onFocus for accessibility
          onPointerLeave={() => setStatus(undefined)}
        />
      </section>
    );
  }
);

export default AvailabilityGridReadCell;
