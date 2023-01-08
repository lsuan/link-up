import { getFormattedHours } from "./formUtils";

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

const createDateLabels = (startDate: Date, endDate: Date) => {
  const dateLabels = document.createElement("div");
  dateLabels.classList.add(
    "sticky",
    "top-0",
    "flex",
    "w-fit",
    "justify-center"
  );
  const fillCell = document.createElement("div");
  fillCell.classList.add("w-12", "px-2");
  dateLabels.append(fillCell);
  for (
    let date = new Date(startDate);
    date < endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateLabel = document.createElement("label");
    dateLabel.classList.add(
      "text-xs",
      "text-center",
      "font-semibold",
      "pb-2",
      "select-none",
      "pointer-events-none",
      "w-20",
      "text-center"
    );

    const dateText = new Intl.DateTimeFormat("en-us", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(date);

    dateLabel.innerText = `${dateText}`;
    dateLabels.append(dateLabel);
  }
  return dateLabels;
};

const createHourLabels = (startHour: number, endHour: number) => {
  const allHours = [...Array(endHour - startHour + 1).keys()].map(
    (i) => i + startHour
  );
  const formattedHours = getFormattedHours(allHours, "short");

  const hourLabels = document.createElement("div");
  hourLabels.classList.add(
    "flex",
    "flex-col",
    "w-12",
    "px-2",
    "sticky",
    "left-0",
    "items-center",
    "justify-between",
    "bg-inherit",
    "gap-3"
  );

  formattedHours.forEach((hour) => {
    const hourLabel = document.createElement("div");
    hourLabel.classList.add(
      "text-xs",
      "font-semibold",
      "w-max",
      "flex",
      "justify-center",
      "items-start",
      "pointer-events-none"
    );
    hourLabel.innerText = `${hour}`;
    hourLabels.appendChild(hourLabel);
  });

  return hourLabels;
};

export const createTable = (
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  tableId: string
) => {
  let table = document.getElementById(tableId);

  if (!table || table.children.length !== 0) {
    return;
  }

  const dateBeforeEnd = new Date(endDate).setDate(endDate.getDate() - 1);

  const dateLabels = createDateLabels(startDate, endDate);
  table.parentElement?.prepend(dateLabels);

  const startHour = getHourNumber(startTime),
    endHour = getHourNumber(endTime);
  const hourLabels = createHourLabels(startHour, endHour);
  table.append(hourLabels);

  const availabilityGrid = document.createElement("div");
  availabilityGrid.classList.add(
    "rounded-lg",
    "flex",
    "border",
    "overflow-hidden"
  );

  for (
    let date = new Date(startDate), colIndex = 0;
    date < endDate;
    date.setDate(date.getDate() + 1), colIndex++
  ) {
    const col = document.createElement("div");
    col.classList.add("flex", "flex-col", "rounded-lg", "day-col");
    const dateData = date.toISOString().split("T")[0] as string;
    col.setAttribute("data-date", dateData);

    for (
      let hour = startHour, rowIndex = 0;
      hour < endHour;
      hour++, rowIndex++
    ) {
      const cell = document.createElement("div");
      cell.setAttribute("data-time", `${hour}-${hour + 1}`);
      cell.setAttribute("data-row-index", rowIndex.toString());
      cell.setAttribute("data-col-index", colIndex.toString());
      cell.classList.add(
        "time-cell",
        "h-8",
        "hover:cursor-pointer",
        "w-20",
        "transition-colors"
      );
      if (date < new Date(dateBeforeEnd)) {
        cell.classList.add("border-r");
      }
      if (hour !== endHour - 1) {
        cell.classList.add("border-b");
      }
      col.append(cell);
    }
    availabilityGrid.append(col);
  }
  table.append(availabilityGrid);
};
