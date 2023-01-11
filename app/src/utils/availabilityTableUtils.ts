import { getFormattedHours } from "./formUtils";

export type UserAvailability = {
  user: string;
  name:
    | {
        firstName: string;
        lastName: string | null;
      }
    | string;
  availability: object;
};

export const resetResponses = () => {
  document
    .querySelectorAll("#availability-responses .date-col .time-cell")
    .forEach((cell) => {
      cell.classList.remove("bg-indigo-500");
    });
};

// OPTIMIZE: Reactify this file and availability grid implemention

export const getHourNumber = (time: string) => {
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

export const categorizeUsers = (attendees: UserAvailability[]) => {
  const categorizedUsers = new Map<string, string[]>();
  attendees.forEach((attendee) => {
    let name: string;
    if (typeof attendee.name === "string") {
      name = attendee.name;
    } else {
      name = attendee.name.firstName;
    }

    for (const [date, times] of Object.entries(attendee.availability)) {
      times.forEach((time: string) => {
        const timeKey = `${date}:${time}`;
        const users = categorizedUsers.get(timeKey);
        if (users) {
          categorizedUsers.set(timeKey, [...users, name]);
        } else {
          categorizedUsers.set(timeKey, [name]);
        }
      });
    }
  });

  return categorizedUsers;
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
  tableId: "availability-responses" | "availability-input"
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
    col.classList.add("flex", "flex-col", "date-col");
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
      cell.classList.add("time-cell", "h-8", "w-20", "transition-colors");
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

export const fillTable = (
  attendees: UserAvailability[],
  tableId: "availability-responses" | "availability-input"
) => {
  attendees.forEach((attendee) => {
    console.log(attendee);
    for (const [date, hours] of Object.entries(attendee.availability)) {
      hours.forEach((hour: string) => {
        const cell = document.querySelector(
          `#${tableId} .date-col[data-date="${date}"] .time-cell[data-time="${hour}"]`
        );
        cell?.classList.add("bg-indigo-500", "hover:cursor-pointer");
      });
    }
  });
};
