import { useAtom } from "jotai";
import { date } from "zod";
import {
  categorizeUsers,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { hoverInfo } from "./AvailabilityGrid";

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

  const categorizedUsers = categorizeUsers(attendees as UserAvailability[]);
  const isUserAvailable = (date: Date, time: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    const timeKey = `${formattedDate}:${time}`;
    return categorizedUsers.get(timeKey) !== undefined;
  };

  const getUsersByTime = (date: Date, time: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    const timeKey = `${formattedDate}:${time}`;
    const users = categorizedUsers.get(timeKey);
    setHoverInfoText(users ?? []);
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
                      ? "cursor-pointer bg-indigo-500"
                      : ""
                  }`}
                  onMouseOver={() => {
                    isUserAvailable(date, `${hour}-${hour + 1}`)
                      ? getUsersByTime(date, `${hour}-${hour + 1}`)
                      : null;
                  }}
                  onMouseLeave={() => {
                    hoverInfoText.length !== 0 ? setHoverInfoText([]) : null;
                  }}
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
