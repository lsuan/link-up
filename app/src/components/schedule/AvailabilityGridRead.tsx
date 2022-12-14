import { useEffect, useState, memo } from "react";
import { UserAvailability } from "../../utils/availabilityTableUtils";
import GridReadCell from "./GridReadCell";

const AvailabilityGridRead = memo(function AvailabilityGridRead({
  dates,
  hours,
  attendees,
}: {
  dates: Date[];
  hours: number[];
  attendees: UserAvailability[];
}) {
  const [allUsers, setAllUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!attendees) {
      return;
    }

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
  }, [attendees]);

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
                <GridReadCell
                  key={`${hour}-${hour + 1}`}
                  attendees={attendees}
                  allUsers={allUsers}
                  dates={dates}
                  date={date}
                  dateIndex={dateIndex}
                  hours={hours}
                  hour={hour}
                  hourIndex={hourIndex}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

export default AvailabilityGridRead;
