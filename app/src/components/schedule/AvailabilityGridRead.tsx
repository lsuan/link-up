import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  categorizeUsers,
  setColors,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { hoverInfo } from "./AvailbilityResponses";

function AvailabilityGridRead({
  dates,
  hours,
  attendees,
}: {
  dates: Date[];
  hours: number[];
  attendees: UserAvailability[];
}) {
  const [hoverInfoText, setHoverInfoText] = useAtom(hoverInfo);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  useEffect(() => {
    if (attendees.length > 0) {
      const users: string[] = [];
      attendees.forEach((attendee) => {
        const name = attendee.name;

        typeof name === "string"
          ? users.push(name)
          : users.push(
              `${name.firstName}${name.lastName ? ` ${name.lastName}` : ""}`
            );
      });
      setAllUsers([...users]);
    }
  }, [attendees]);

  const categorizedUsers = categorizeUsers(attendees as UserAvailability[]);

  const getUsers = (date: Date, time: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    const timeKey = `${formattedDate}:${time}`;
    return categorizedUsers.get(timeKey);
  };
  const isUserAvailable = (date: Date, time: string) => {
    return getUsers(date, time) !== undefined;
  };

  const getUsersByTime = (date: Date, time: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    const timeKey = `${formattedDate}:${time}`;
    const users = categorizedUsers.get(timeKey) ?? [];
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

  return (
    <div className="flex overflow-hidden rounded-lg border">
      {dates.map((date: Date, dateIndex) => {
        return (
          <div
            key={date.toISOString().split("T")[0]}
            className="flex flex-col"
            data-date={date.toISOString().split("T")[0]}
          >
            {hours.map((hour, hourIndex) => {
              return (
                <div
                  key={`${hour}-${hour + 1}`}
                  date-time={`${hour}-${hour + 1}`}
                  className={`h-8 w-20 transition-all ${
                    dateIndex !== dates.length - 1 ? "border-r" : ""
                  } ${hourIndex !== hours.length - 1 ? "border-b" : ""} ${
                    isUserAvailable(date, `${hour}-${hour + 1}`)
                      ? `cursor-pointer ${setColors(
                          getUsers(date, `${hour}-${hour + 1}`)?.length ?? 0
                        )}`
                      : ""
                  }`}
                  onMouseOver={() => {
                    isUserAvailable(date, `${hour}-${hour + 1}`)
                      ? getUsersByTime(date, `${hour}-${hour + 1}`)
                      : null;
                  }}
                  onMouseLeave={() => setHoverInfoText(undefined)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default AvailabilityGridRead;
