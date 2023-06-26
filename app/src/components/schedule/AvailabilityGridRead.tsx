import { type Availability, type Schedule } from "@prisma/client";
import { memo, useState } from "react";
import { type CalendarDays } from "../../utils/availabilityUtils";
import { trpc } from "../../utils/trpc";
import AvailabilityGridReadCell from "./AvailabilityGridReadCell";

interface AvailabilityGridReadProps {
  scheduleId: Schedule["id"];
  calendarDays: CalendarDays;
}

const AvailabilityGridRead = memo(
  ({ scheduleId, calendarDays }: AvailabilityGridReadProps) => {
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
    const [availability, setAvailability] = useState<Availability[]>([]);

    trpc.schedule.getAllAvailability.useQuery(scheduleId, {
      onSuccess: (data) => {
        setAvailability(data);
      },
      refetchOnWindowFocus: false,
    });

    return (
      <div
        id="availability-responses-grid"
        className="flex overflow-hidden rounded-lg border"
      >
        {Object.entries(calendarDays).map(([day, hours]) => (
          <div
            key={day}
            className="flex flex-col"
            // data-date={
            //   new Date(date.toDateString()).toISOString().split("T")[0]
            // }
          >
            {hours.map(
              (hour, hourIndex) =>
                hourIndex !== hours.length - 1 && (
                  <AvailabilityGridReadCell
                    key={hour}
                    // attendees={attendees}
                    // allUsers={allUsers}
                    // dates={dates}
                    // date={date}
                    // dateIndex={dateIndex}
                    hour={hour}
                    availability={availability}
                  />
                )
            )}
          </div>
        ))}
      </div>
    );
  }
);

export default AvailabilityGridRead;
