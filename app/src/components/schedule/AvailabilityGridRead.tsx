import { memo, useEffect, useState } from "react";
import { type CalendarDay } from "../../utils/availabilityUtils";
import AvailabilityGridReadCell from "./AvailabilityGridReadCell";

interface AvailabilityGridReadProps {
  calendarDays: CalendarDay[];
}

const AvailabilityGridRead = memo(
  ({ calendarDays }: AvailabilityGridReadProps) => {
    // const [allUsers, setAllUsers] = useState<string[]>([]);

    // useEffect(() => {
    //   if (!attendees) {
    //     return;
    //   }

    //   const users: string[] = [];
    //   attendees.forEach((attendee) => {
    //     const { name } = attendee;
    //     users.push(name);
    //   });
    //   setAllUsers([...users]);
    // }, [attendees]);

    return (
      <div
        id="availability-responses-grid"
        className="flex overflow-hidden rounded-lg border"
      >
        {calendarDays.map((day) => (
          <div
            key={day.date.getUTCDate()}
            className="flex flex-col"
            // data-date={
            //   new Date(date.toDateString()).toISOString().split("T")[0]
            // }
          >
            {day.timeSlots.map((hour, hourIndex) => (
              <AvailabilityGridReadCell
                key={hour}
                // attendees={attendees}
                // allUsers={allUsers}
                // dates={dates}
                // date={date}
                // dateIndex={dateIndex}
                hours={day.timeSlots}
                hourIndex={hourIndex}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

export default AvailabilityGridRead;
