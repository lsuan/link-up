import { useEffect, useState } from "react";
import { JSONObject } from "superjson/dist/types";
import {
  createTable,
  resetResponses,
} from "../../utils/availabilityTableUtils";
import { AvailabilityProps } from "./AvailabilitySection";

export type AttendeeAvailability = {
  availability: object;
};

function AvailabilityResponses({ schedule }: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime } = schedule;
  const { attendees } = schedule as { attendees: JSONObject };
  const [isTableReady, setIsTableReady] = useState<boolean>(false);

  useEffect(() => {
    createTable(
      startDate,
      endDate,
      startTime,
      endTime,
      "availability-responses"
    );
    setIsTableReady(true);
  }, []);

  useEffect(() => {
    if (!isTableReady) {
      return;
    }
    resetResponses();

    for (const [user, data] of Object.entries(attendees)) {
      const availability = (data as AttendeeAvailability)["availability"];
      for (const [date, hours] of Object.entries(availability)) {
        hours.forEach((hour: string) => {
          document
            .querySelector(
              `#availability-responses .date-col[data-date="${date}"] .time-cell[data-time="${hour}"]`
            )
            ?.classList.add("bg-indigo-500");
        });
      }
    }
  }, [isTableReady, schedule]);

  return (
    <section>
      <div className="horizontal-scrollbar availability-table relative my-4 grid place-items-center overflow-x-scroll pb-4">
        <div
          className="border-grey-500 flex w-fit pl-1"
          id="availability-responses"
        ></div>
      </div>
    </section>
  );
}
export default AvailabilityResponses;
