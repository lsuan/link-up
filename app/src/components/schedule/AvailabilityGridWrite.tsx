import { useAtom } from "jotai";
import { BaseSyntheticEvent, useState } from "react";
import { notice } from "../../pages/schedule/[slug]";
import { disabled, selected } from "./AvailabilityInput";

function AvailabilityGridWrite({
  dates,
  hours,
}: {
  dates: Date[];
  hours: number[];
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [, setIsDisabled] = useAtom(disabled);
  const [selectedCells, setSelectedCells] = useAtom(selected);
  const [, setNoticeMessage] = useAtom(notice);

  const saveCell = (cell: HTMLDivElement, timeKey: string) => {
    if (cell.classList.contains("bg-indigo-500")) {
      cell.classList.remove("bg-indigo-500");
      const foundIndex = selectedCells.findIndex((key) => key === timeKey);
      const prevElements = selectedCells.slice(0, foundIndex);
      const rest = selectedCells.slice(foundIndex + 1);
      setSelectedCells([...prevElements, ...rest]);
    } else {
      cell.classList.add("bg-indigo-500");
      setSelectedCells([...selectedCells, timeKey]);
    }
  };

  const onMouseOver = (e: BaseSyntheticEvent, timeKey: string) => {
    if (!isEditing) {
      return;
    }

    const cell = e.target as HTMLDivElement;
    saveCell(cell, timeKey);
  };

  return (
    <div className="flex overflow-hidden rounded-lg border">
      {dates.map((date: Date, dateIndex) => {
        return (
          <div
            key={date.toISOString().split("T")[0]}
            className="flex flex-col"
            data-date={date.toISOString().split("T")[0]}
          >
            {hours.map((hour, hourIndex) => {
              return (
                <div
                  key={`${hour}-${hour + 0.5}`}
                  date-time={`${hour}-${hour + 0.5}`}
                  className={`h-10 w-20 cursor-pointer transition-all ${
                    dateIndex !== dates.length - 1 ? "border-r" : ""
                  } ${hourIndex !== hours.length - 1 ? "border-b" : ""} ${
                    selectedCells.includes(
                      `${date.toISOString().split("T")[0]}:${hour}-${
                        hour + 0.5
                      }`
                    )
                      ? "bg-indigo-500"
                      : ""
                  }`}
                  onMouseDown={(e) => {
                    setIsEditing(true);
                    setIsDisabled(false);
                    setNoticeMessage("");
                    saveCell(
                      e.target as HTMLDivElement,
                      `${date.toISOString().split("T")[0]}:${hour}-${
                        hour + 0.5
                      }`
                    );
                  }}
                  onMouseOver={(e) =>
                    onMouseOver(
                      e,
                      `${date.toISOString().split("T")[0]}:${hour}-${
                        hour + 0.5
                      }`
                    )
                  }
                  onMouseUp={() => setIsEditing(false)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default AvailabilityGridWrite;
