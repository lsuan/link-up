import { type Availability } from "@prisma/client";
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
  CalendarDays,
  CellColorStatus,
  categorizeUsers,
  cellStyles,
  getCellColor,
  getMostUsers,
  parseRange,
  setColors,
  type AvailabilityStatus,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import {
  THIRTY_MINUTES_MS,
  getShortenedDateWithDay,
} from "../../utils/timeUtils";
import AvailabilityCellPopup from "./AvailabilityCellPopup";

interface AvailabilityGridReadCellProps {
  hour: number;
  // TODO: change based on the number of attendees
  availability: Availability[];
}

const AvailabilityGridReadCell = memo(
  ({
    // attendees,
    // allUsers,
    // dates,
    // date,
    // dateIndex,
    hour,
    availability,
  }: AvailabilityGridReadCellProps) => {
    const [status, setStatus] = useState<AvailabilityStatus>();
    // const categorizedUsers = useMemo(
    //   () => categorizeUsers(attendees),
    //   [attendees]
    // );
    // const mostUsers = useMemo(
    //   () => getMostUsers(categorizedUsers),
    //   [categorizedUsers]
    // );

    // const getUsers = useCallback(
    //   (currentDate: Date, currentHour: string) => {
    //     if (!categorizedUsers) {
    //       return;
    //     }
    //     const formattedDate = currentDate.toISOString().split("T")[0];
    //     const timeKey = `${formattedDate}:${currentHour}`;
    //     return categorizedUsers.get(timeKey);
    //   },
    //   [categorizedUsers]
    // );

    // const setUsersByTime = (
    //   currentDate: Date,
    //   currentHour: string,
    //   availabilityStatus: AvailabilityStatus
    // ) => {
    //   const users = getUsers(currentDate, currentHour);
    //   if (!users) {
    //     return;
    //   }
    //   const unavailableUsers = allUsers.filter(
    //     (user) => !users?.includes(user)
    //   );
    //   const formattedDate = currentDate.toISOString().split("T")[0];
    //   const timeKey = `${formattedDate}:${currentHour}`;
    //   const updatedAvailabilityStatus = {
    //     ...availabilityStatus,
    //     timeKey,
    //     available: users,
    //     unavailable: unavailableUsers,
    //   };

    //   setStatus(
    //     updatedAvailabilityStatus?.available.length !== 0
    //       ? updatedAvailabilityStatus
    //       : undefined
    //   );
    // };

    // const onMouseOver = (
    //   e: React.MouseEvent,
    //   currentDate: Date,
    //   currentHour: string
    // ) => {
    //   const availabilityStatus: AvailabilityStatus = {
    //     timeKey: "",
    //     available: [],
    //     unavailable: [],
    //     clientX: e.clientX,
    //   };

    //   setUsersByTime(currentDate, currentHour, availabilityStatus);
    // };

    // const users = useMemo(
    //   () => getUsers(date, `${hour}-${hour + 0.5}`)?.length,
    //   [date, hour, getUsers]
    // );
    // const colors = useMemo(() => setColors(mostUsers), [mostUsers]);

    // const cellColor = useMemo(
    //   () => getCellColor(users ?? 0, mostUsers, colors),
    //   [mostUsers, colors, users]
    // );

    // TODO: fix styling for long words

    const colorStatus = getCellColorStatus(availability, hour);

    return (
      <section className="relative">
        {status && status.available.length !== 0 && (
          <AvailabilityCellPopup {...status} />
        )}
        <div
          data-time={hour}
          className={cellStyles({ fill: colorStatus, readOnly: true })}
          // onPointerOver={(e) =>
          //   users && onMouseOver(e, date, `${hour}-${hour + 0.5}`)
          // }
          // onFocus={(e) => e} // TODO: include onFocus for accessibility
          // onPointerLeave={() => setStatus(undefined)}
        />
      </section>
    );
  }
);

/** Returns  "filled" or "empty" if a user filled out available for a given cell. */
function getCellColorStatus(
  availability: Availability[],
  currentHour: number
): CellColorStatus {
  let found = false;
  availability.forEach((availabilityRecord) => {
    Object.values(availabilityRecord.availability as CalendarDays).forEach(
      (hours) => {
        if (hours.find((hour) => hour === currentHour)) {
          found = true;
        }
      }
    );
  });
  return found ? "filled" : "empty";
}

export default AvailabilityGridReadCell;
