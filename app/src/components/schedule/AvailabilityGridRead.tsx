import { memo, useEffect, useState } from "react";
import { type UserAvailability } from "../../utils/availabilityUtils";
import AvailabilityGridReadCell from "./AvailabilityGridReadCell";

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
      users.push(name);
    });
    setAllUsers([...users]);
  }, [attendees]);

  return (
    <div
      id="availability-responses-grid"
      className="flex overflow-hidden rounded-lg border"
    >
      {dates.map((date: Date, dateIndex) => {
        return (
          <div
            key={date.toISOString().split("T")[0]}
            className="flex flex-col"
            data-date={
              new Date(date.toDateString()).toISOString().split("T")[0]
            }
          >
            {hours.map((hour, hourIndex) => {
              return (
                <AvailabilityGridReadCell
                  key={`${hour}-${hour + 0.5}`}
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
