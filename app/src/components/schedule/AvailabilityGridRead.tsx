import { type Availability } from "@prisma/client";
import { memo } from "react";
import {
  type BlockAvailabilityCounts,
  type CalendarDays,
} from "../../utils/availabilityUtils";
import AvailabilityGridReadCell from "./AvailabilityGridReadCell";

interface AvailabilityGridReadProps {
  calendarDays: CalendarDays;
  availabilities: Availability[];
}

const AvailabilityGridRead = memo(
  ({ calendarDays, availabilities }: AvailabilityGridReadProps) => {
    const blockAvailabilityCounts = getAvailbilityCounts(availabilities);

    return (
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
                    day={day}
                    hour={hour}
                    availabilities={availabilities}
                    blockAvailabilityCounts={blockAvailabilityCounts}
                  />
                )
            )}
          </div>
        ))}
      </div>
    );
  }
);

// TODO: figure out how to better convert `Prisma.JsonValue` to `CalendarDays`
/** Sets the block availability counts and users for each availability record. */
function getAvailbilityCounts(availabilities: Availability[]) {
  return availabilities.reduce<BlockAvailabilityCounts>(
    (blockAvailabilityCounts, currentAvailabilities) => {
      Object.values(currentAvailabilities.availability as CalendarDays).forEach(
        (hours) => {
          hours.forEach((hour) => {
            blockAvailabilityCounts[hour] = {
              count: (blockAvailabilityCounts[hour]?.count ?? 0) + 1,
              availableUsers: [
                ...(blockAvailabilityCounts[hour]?.availableUsers ?? []),
                currentAvailabilities.user,
              ],
              unavailableUsers: availabilities
                .filter(
                  (availability) =>
                    !Object.values(availability.availability as CalendarDays)
                      .flatMap((selectedHours) => selectedHours)
                      .includes(hour)
                )
                .map((availability) => availability.user),
            };
          });
        }
      );
      return blockAvailabilityCounts;
    },
    {}
  );
}

export default AvailabilityGridRead;
