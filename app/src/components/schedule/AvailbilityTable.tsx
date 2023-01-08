import { useEffect } from "react";
import { getFormattedHours } from "../../utils/formHelpers";
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
    let table = document.getElementById("availability-table");

    if (!table || table.children.length !== 0) {
      return;
    }

    const startHour = getHourNumber(startTime),
      endHour = getHourNumber(endTime);

    const allHours = [...Array(endHour - startHour + 1).keys()].map(
      (i) => i + startHour
    );
    const formattedHours = getFormattedHours(allHours, "short");

    const hoursContainer = document.createElement("div");
    hoursContainer.classList.add(
      "flex",
      "flex-col",
      "pr-1",
      "sticky",
      "left-0",
      "justify-end",
      "bg-neutral-500"
    );

    formattedHours.forEach((hour) => {
      const hourLabel = document.createElement("div");
      hourLabel.classList.add(
        "h-8",
        "text-xs",
        "font-semibold",
        "w-max",
        "flex",
        "justify-center",
        "items-center"
      );
      hourLabel.innerText = `${hour}`;
      hoursContainer.appendChild(hourLabel);
    });
    table.parentElement?.prepend(hoursContainer);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const colContainer = document.createElement("div");
      colContainer.classList.add("flex", "flex-col");

      const colLabel = document.createElement("label");
      const dateLabel = new Intl.DateTimeFormat("en-us", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }).format(date);
      colLabel.classList.add("text-sm", "text-center", "font-semibold", "pb-2");
      colLabel.innerText = `${dateLabel}`;

      const col = document.createElement("div");

      colContainer.append(colLabel, col);
      col.classList.add("flex", "flex-col", "rounded-lg", "day-col");

      for (let hour = startHour, index = 0; hour <= endHour; hour++, index++) {
        const cell = document.createElement("div");
        cell.classList.add("h-8", "border", "hover:cursor-pointer", "w-20");
        if (index === 0 && date.getDate() === startDate.getDate()) {
          cell.classList.add("rounded-tl-lg");
        }
        if (
          hour === getHourNumber(endTime) &&
          date.getDate() === startDate.getDate()
        ) {
          cell.classList.add("rounded-bl-lg");
        }
        if (index === 0 && date.getDate() === endDate.getDate()) {
          cell.classList.add("rounded-tr-lg");
        }
        if (
          hour === getHourNumber(endTime) &&
          date.getDate() === endDate.getDate()
        ) {
          cell.classList.add("rounded-br-lg");
        }
        col.append(cell);
      }
      table.append(colContainer);
    }
  }, []);

  // TODO: ensure that table becomes uneditable on schedule page
  return (
    <section>
      <div className="rounded-full">Key</div>
      <div className="horizontal-scrollbar relative my-4 flex overflow-x-scroll pb-4">
        <div
          className="border-grey-500 flex w-fit pl-1"
          id="availability-table"
        ></div>
      </div>
    </section>
  );
}
export default AvailabilityTable;
