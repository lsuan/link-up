import { type Availability, type Schedule } from "@prisma/client";
import { memo, useState } from "react";
import { type CalendarDays } from "../../utils/availabilityUtils";
import { trpc } from "../../utils/trpc";
import AvailabilityGridReadCell from "./AvailabilityGridReadCell";

interface AvailabilityGridReadProps {
  calendarDays: CalendarDays;
  availabilities: Availability[];
}

const AvailabilityGridRead = memo(
  ({ calendarDays, availabilities }: AvailabilityGridReadProps) => (
    <div
      id="availability-responses-grid"
      className="flex overflow-hidden rounded-lg border"
    >
      {Object.entries(calendarDays).map(([day, hours]) => (
        <div key={day} className="flex flex-col">
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
                  availabilities={availabilities}
                />
              )
          )}
        </div>
      ))}
    </div>
  )
);

export default AvailabilityGridRead;
