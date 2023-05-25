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
  type AvailabilityStatus,
  type UserAvailability,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import {
  THIRTY_MINUTES_MS,
  getShortenedDateWithDay,
} from "../../utils/timeUtils";
import AvailabilityCellPopup from "./AvailabilityCellPopup";

interface AvailabilityGridReadCellProps {
  hours: number[];
  hourIndex: number;
}

const AvailabilityGridReadCell = memo(
  ({
    // attendees,
    // allUsers,
    // dates,
    // date,
    // dateIndex,
    hours,
    hourIndex,
  }: AvailabilityGridReadCellProps) => {
    const hour = hours[hourIndex];
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

    // don't render last cell
    if (hourIndex === hours.length - 1) {
      return null;
    }

    return (
      <section className="relative">
        {status && status.available.length !== 0 && (
          <AvailabilityCellPopup {...status} />
        )}
        <div
          data-time={`${hour}-${hour + THIRTY_MINUTES_MS}`}
          className={`h-10 w-20 border transition-all ${
            // dateIndex !== dates.length - 1 ? "border-r" : ""
            // } ${
            //   hourIndex !== hours.length - 1
            //     ? "border-b border-b-neutral-100"
            //     : ""
            // } ${users ? `cursor-pointer ${cellColor}` : ""}`}
            ""
          }`}
          // onPointerOver={(e) =>
          //   users && onMouseOver(e, date, `${hour}-${hour + 0.5}`)
          // }
          // onFocus={(e) => e} // TODO: include onFocus for accessibility
          // onPointerLeave={() => setStatus(undefined)}
        >
          {new Date(hour).getMinutes()}
        </div>
      </section>
    );
  }
);

export default AvailabilityGridReadCell;
