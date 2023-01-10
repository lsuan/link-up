import { useEffect, useState } from "react";
import {
  UserAvailability,
  createTable,
  fillTable,
  resetResponses,
} from "../../utils/availabilityTableUtils";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityResponses({ schedule }: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime, attendees } = schedule;
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
    fillTable(attendees as UserAvailability[], "availability-responses");
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
