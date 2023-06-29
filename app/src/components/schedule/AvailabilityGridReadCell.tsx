import { type Availability } from "@prisma/client";
import React, { memo, useState } from "react";
import {
  cellStyles,
  type AvailabilityStatus,
  type BlockAvailabilityCounts,
  type CellColorStatus,
} from "../../utils/availabilityUtils";
import AvailabilityCellPopup from "./AvailabilityCellPopup";

interface AvailabilityGridReadCellProps {
  hour: number;
  availabilities: Availability[];
  blockAvailabilityCounts: BlockAvailabilityCounts;
}

const AvailabilityGridReadCell = memo(
  ({
    // attendees,
    // allUsers,
    // dates,
    // date,
    // dateIndex,
    hour,
    availabilities,
    blockAvailabilityCounts,
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

    const colorStatus = getCellColorStatus(
      hour,
      availabilities,
      blockAvailabilityCounts
    );

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

/** Returns the specific fill value for a given cell. */
function getCellColorStatus(
  currentHour: number,
  availabilities: Availability[],
  blockAvailabilityCounts: BlockAvailabilityCounts
): CellColorStatus {
  const total = availabilities.length;
  const currentBlock = blockAvailabilityCounts[currentHour];
  const ratio = (currentBlock?.count ?? 0) / total;

  if (ratio > 0.8) {
    return 900;
  }
  if (ratio > 0.6) {
    return 700;
  }
  if (ratio > 0.4) {
    return 500;
  }
  if (ratio > 0.2) {
    return 300;
  }
  if (ratio > 0) {
    return 100;
  }
  return 0;
}

export default AvailabilityGridReadCell;
