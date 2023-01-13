import { useAtom } from "jotai";
import { memo, useCallback, useMemo } from "react";
import {
  categorizeUsers,
  getCellColor,
  getMostUsers,
  setColors,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { hoverInfo } from "./AvailabilityResponses";

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
  const [hoverInfoText, setHoverInfoText] = useAtom(hoverInfo);
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

  const setUsersByTime = (date: Date, hour: string) => {
    const users = getUsers(date, hour);
    if (!users) {
      return;
    }
    const unavailableUsers = allUsers.filter((user) => {
      return !users?.includes(user);
    });
    const availabilityStatus = {
      available: users,
      unavailable: unavailableUsers,
    };
    setHoverInfoText(
      availabilityStatus?.available.length !== 0
        ? availabilityStatus
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
    <div
      date-time={`${hour}-${hour + 0.5}`}
      className={`h-10 w-20 transition-all ${
        dateIndex !== dates.length - 1 ? "border-r" : ""
      } ${
        hourIndex !== hours.length - 1 ? "border-b border-b-neutral-100" : ""
      } ${users ? `cursor-pointer ${cellColor}` : ""}
`}
      onMouseOver={() =>
        users ? setUsersByTime(date, `${hour}-${hour + 0.5}`) : null
      }
      onMouseLeave={() => setHoverInfoText(undefined)}
    />
  );
});

export default AvailabilityGridReadCell;
