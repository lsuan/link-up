import { useEffect, useMemo } from "react";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityTable({ schedule }: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime } = schedule;

  const getHourNumber = (time: string) => {
    const [hour, meridiem] = time.split(" ");
    const hourNumber = parseInt(hour?.split(":")[0] || "");

    if (meridiem === "AM" && hourNumber !== 12) {
      return hourNumber;
    } else if (meridiem === "PM" && hourNumber !== 12) {
      return hourNumber + 12;
    } else if (meridiem === "AM" && hourNumber === 12) {
      return 24;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    const createAvailabilityTable = () => {
      let table = document.getElementById("availability-table");

      if (!table || table.children.length !== 0) {
        return;
      }

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const row = document.createElement("div");
        row.classList.add("flex", "flex-col", "w-28", "rounded-lg");
        for (
          let hour = getHourNumber(startTime), index = 0;
          hour < getHourNumber(endTime);
          hour++, index++
        ) {
          console.log(date);
          const cell = document.createElement("div");
          cell.classList.add("h-8", "border");
          if (index === 0 && date.getDate() === startDate.getDate()) {
            cell.classList.add("rounded-tl-lg");
          }
          if (
            hour === getHourNumber(endTime) - 1 &&
            date.getDate() === startDate.getDate()
          ) {
            cell.classList.add("rounded-bl-lg");
          }
          if (index === 0 && date.getDate() === endDate.getDate()) {
            cell.classList.add("rounded-tr-lg");
          }
          if (
            hour === getHourNumber(endTime) - 1 &&
            date.getDate() === endDate.getDate()
          ) {
            cell.classList.add("rounded-br-lg");
          }
          row.append(cell);
        }
        table.append(row);
      }
    };
    createAvailabilityTable();
  }, []);

  // TODO: ensure that table becomes uneditable on schedule page
  return (
    <section>
      <div className="rounded-full">Key</div>
      <div className="horizontal-scrollbar my-8 grid overflow-x-scroll">
        <div
          className="border-grey-500 flex w-fit pb-4"
          id="availability-table"
        ></div>
      </div>
    </section>
  );
}
export default AvailabilityTable;
