import { useEffect } from "react";
import { createTable } from "../../utils/availabilityTableUtils";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityResponses({ schedule }: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime } = schedule;

  useEffect(() => {
    createTable(
      startDate,
      endDate,
      startTime,
      endTime,
      "availability-responses"
    );
  }, [createTable]);

  return (
    <section>
      <div className="rounded-full">Key</div>
      <div className="horizontal-scrollbar relative my-4 flex overflow-x-scroll pb-4">
        <div
          className="border-grey-500 flex w-fit pl-1"
          id="availability-responses"
        ></div>
      </div>
    </section>
  );
}
export default AvailabilityResponses;
