import { isSuspensePromiseAlreadyCancelled } from "jotai/core/suspensePromise";
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
  UserAvailability,
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

const AvailabilityGridReadCell = memo(function AvailabilityGridReadCell({
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
}) {
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
    (date: Date, hour: string) => {
      if (!categorizedUsers) {
        return;
      }
      const formattedDate = date.toISOString().split("T")[0];
      const timeKey = `${formattedDate}:${hour}`;
      return categorizedUsers.get(timeKey);
    },
    [categorizedUsers]
  );

  const onMouseOver = (e: React.MouseEvent, date: Date, hour: string) => {
    console.log(e);
    const cell = e.target as HTMLDivElement;
    console.log("cell offset ", cell.offsetLeft);

    const availabilityStatus: AvailabilityStatus = {
      timeKey: "",
      available: [],
      unavailable: [],
      clientX: e.clientX,
    };

    setUsersByTime(date, hour, availabilityStatus);
  };

  const setUsersByTime = (
    date: Date,
    hour: string,
    availabilityStatus: AvailabilityStatus
  ) => {
    const users = getUsers(date, hour);
    if (!users) {
      return;
    }
    const unavailableUsers = allUsers.filter((user) => {
      return !users?.includes(user);
    });
    const formattedDate = date.toISOString().split("T")[0];
    const timeKey = `${formattedDate}:${hour}`;
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

  const users = useMemo(
    () => getUsers(date, `${hour}-${hour + 0.5}`)?.length,
    [date, hour]
  );
  const colors = useMemo(() => setColors(mostUsers), [mostUsers]);

  const cellColor = useMemo(
    () => getCellColor(users ?? 0, mostUsers, colors),
    [mostUsers, colors, users]
  );

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
          hourIndex !== hours.length - 1 ? "border-b border-b-neutral-100" : ""
        } ${users ? `cursor-pointer ${cellColor}` : ""}`}
        onMouseOver={(e) =>
          users ? onMouseOver(e, date, `${hour}-${hour + 0.5}`) : null
        }
        onMouseLeave={() => setStatus(undefined)}
      />
    </section>
  );
});

function AvailabilityPopUp(availabilityStatus: AvailabilityStatus) {
  const popupRef = useRef<HTMLDivElement>(null);
  const { timeKey, available, unavailable, clientX } = availabilityStatus;
  const dateString = timeKey.split(":")[0] as string;
  const [startTime, endTime] = parseRange(timeKey) as [string, string];
  const [start, end] = getFormattedHours(
    [Number(startTime), Number(endTime)],
    "long"
  );
  const [positions, setPositions] = useState<PopupPosition>();

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return;
    }

    const positions = {
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
      positions.vertical =
        topOverflow > gridHeight ? "bottom-full" : "top-full";
      positions.horizontal =
        clientX < (containerWidth + containerPaddingX) / 2
          ? "left-0"
          : "right-0";
      positions.translate = "";
      setPositions({ ...positions });
      return;
    }

    if (
      clientX - popupWidth - cellWidth / 2 - timeLabelsWidth - borderOffset <=
      0
    ) {
      positions.horizontal = "-right-40";
    }
    if (topOverflow > gridHeight) {
      positions.vertical = "bottom-4";
      positions.translate = "translate-y-4";
    }

    setPositions({ ...positions });
  }, [popupRef.current]);

  return (
    <div
      ref={popupRef}
      className={`absolute z-20 flex w-40 flex-col gap-2 rounded-lg border border-neutral-500 bg-neutral-900 p-2 text-xs transition-all${
        positions
          ? ` ${positions.horizontal} ${positions.vertical} ${positions.translate}`
          : ""
      }`}
    >
      <header className="font-semibold">
        <h5>{getShortenedDateWithDay(new Date(dateString))}</h5>
        <h6>{`${start} — ${end}`}</h6>
      </header>
      <div className="flex flex-col gap-0">
        <p>
          <span className="font-semibold text-indigo-300">Available</span>
          {` (${available.length}): ${available.join(", ")}`}
        </p>
        {unavailable?.length > 0 && (
          <p>
            <span className="font-semibold text-indigo-500">Unavailable</span>
            {` (${unavailable.length}): ${unavailable.join(", ")}`}
          </p>
        )}
      </div>
    </div>
  );
}

export default AvailabilityGridReadCell;
