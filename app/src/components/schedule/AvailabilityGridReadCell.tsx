import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  clientY: number;
};

type PopupPosition = {
  vertical: string;
  horizontal: string;
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
    const availabilityStatus: AvailabilityStatus = {
      timeKey: "",
      available: [],
      unavailable: [],
      clientX: e.clientX,
      clientY: e.clientY,
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
        } ${users ? `cursor-pointer ${cellColor}` : ""}
`}
        onMouseOver={(e) =>
          users ? onMouseOver(e, date, `${hour}-${hour + 0.5}`) : null
        }
        onMouseLeave={() => setStatus(undefined)}
      />
    </section>
  );
});

function AvailabilityPopUp(availabilityStatus: AvailabilityStatus) {
  const { timeKey, available, unavailable, clientX, clientY } =
    availabilityStatus;
  const dateString = timeKey.split(":")[0] as string;
  const [startTime, endTime] = parseRange(timeKey) as [string, string];
  const [start, end] = getFormattedHours(
    [Number(startTime), Number(endTime)],
    "long"
  );
  const grid = document.getElementById("availability-responses-grid");
  const container = document.querySelector(".horizontal-scrollbar.grid");
  const [positions, setPositions] = useState<PopupPosition>();

  useEffect(() => {
    const horizontalBreakpoint = ((container?.clientWidth as number) - 60) / 2;
    const positions = { vertical: "top-0", horizontal: "-left-40" };
    const containerHeight = container?.clientHeight as number;
    if (clientX < horizontalBreakpoint) {
      positions.horizontal = "-right-40";
    }

    if (clientY > containerHeight / 2) {
      positions.vertical = "bottom-0";
    }
    setPositions({ ...positions });
  }, []);

  return (
    <div
      id="availability-popup"
      className={`absolute z-10 flex w-40 flex-col gap-2 rounded-lg border border-neutral-500 bg-neutral-900 p-2 text-xs transition-all${
        positions ? ` ${positions.horizontal} ${positions.vertical}` : ""
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
        {unavailable?.length && (
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
