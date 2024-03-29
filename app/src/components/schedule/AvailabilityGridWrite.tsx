import { notice } from "@ui/Snackbar";
import { useAtom } from "jotai";
import React, { memo, useState } from "react";
import { disabled, selected } from "../../utils/availabilityUtils";

type StartCoordinates = {
  clientX: number;
  clientY: number;
  row: number;
  col: number;
};

const AvailabilityGridWrite = memo(
  ({ dates, hours }: { dates: Date[]; hours: number[] }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [, setIsDisabled] = useAtom(disabled);
    const [selectedCells, setSelectedCells] = useAtom(selected);
    const [, setNoticeMessage] = useAtom(notice);
    const [startCoordinates, setStartCoordinates] =
      useState<StartCoordinates>();
    const [neighbors, setNeighbors] = useState<Set<HTMLDivElement>>(new Set());

    const updateGrid = (
      currentNeighbors: Set<HTMLDivElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      const neighbor = document.querySelector(
        `div[data-row='${rowIndex}'][data-col='${colIndex}']`
      ) as HTMLDivElement;
      const neighborTimeKey = neighbor.getAttribute("data-time") as string;

      selectedCells.includes(neighborTimeKey)
        ? neighbor.classList.remove("bg-indigo-500")
        : neighbor.classList.add("bg-indigo-500");

      currentNeighbors.add(neighbor);
    };

    const initializeSave = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsEditing(true);
      setIsDisabled(false);
      setNoticeMessage({ action: "close", message: "" });
      const cell = e.target as HTMLDivElement;
      const row = parseInt(cell.getAttribute("data-row") as string);
      const col = parseInt(cell.getAttribute("data-col") as string);
      setStartCoordinates({ clientX: e.clientX, clientY: e.clientY, row, col });
      setNeighbors(new Set([cell]));
      updateGrid(neighbors, row, col);
    };

    // FIXME: need to be able to get rid of previous cells while editing
    // keep track of when the mouse direction goes the opposite way
    const onMouseOver = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isEditing || !startCoordinates) {
        return;
      }

      const currentCell = e.target as HTMLDivElement;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const currentRow = parseInt(
        currentCell.getAttribute("data-row") as string
      );
      const currentCol = parseInt(
        currentCell.getAttribute("data-col") as string
      );
      const {
        clientX: startX,
        clientY: startY,
        row: startRow,
        col: startCol,
      } = startCoordinates;

      const currentNeighbors = new Set<HTMLDivElement>([...neighbors]);
      if (currentY < startY && currentX < startX) {
        // going up left
        for (let rowIndex = startRow; rowIndex >= currentRow; rowIndex--) {
          for (let colIndex = startCol; colIndex >= currentCol; colIndex--) {
            updateGrid(currentNeighbors, rowIndex, colIndex);
          }
        }
      } else if (currentY < startY && currentX > startX) {
        // going up right
        for (let rowIndex = startRow; rowIndex >= currentRow; rowIndex--) {
          for (let colIndex = startCol; colIndex <= currentCol; colIndex++) {
            updateGrid(currentNeighbors, rowIndex, colIndex);
          }
        }
      } else if (currentY > startY && currentX < startX) {
        // going down left
        for (let rowIndex = startRow; rowIndex <= currentRow; rowIndex++) {
          for (let colIndex = startCol; colIndex >= currentCol; colIndex--) {
            updateGrid(currentNeighbors, rowIndex, colIndex);
          }
        }
      } else if (currentY > startY && currentX > startX) {
        // going down right
        for (let rowIndex = startRow; rowIndex <= currentRow; rowIndex++) {
          for (let colIndex = startCol; colIndex <= currentCol; colIndex++) {
            updateGrid(currentNeighbors, rowIndex, colIndex);
          }
        }
      } else {
        updateGrid(currentNeighbors, currentRow, currentCol);
      }

      setNeighbors(new Set([...currentNeighbors]));
    };

    const onMouseUp = () => {
      let timeKeys: string[] = [...selectedCells];
      neighbors.forEach((neighbor) => {
        const currentTimeKey = neighbor?.getAttribute("data-time") as string;
        timeKeys.filter((timeKey) => timeKey === currentTimeKey);
        if (selectedCells.includes(currentTimeKey)) {
          timeKeys = timeKeys.filter((timeKey) => timeKey !== currentTimeKey);
        } else {
          timeKeys.push(currentTimeKey);
        }
      });
      setIsEditing(false);
      setSelectedCells([...timeKeys]);
      if (timeKeys.length === 0) {
        setIsDisabled(true);
      }
      setNeighbors(new Set());
    };

    return (
      <div className="flex overflow-hidden rounded-lg border">
        {dates.map((date: Date, dateIndex) => (
          <div
            key={date.toISOString().split("T")[0]}
            className="flex flex-col"
            data-date={
              new Date(date.toDateString()).toISOString().split("T")[0]
            }
          >
            {hours.map((hour, hourIndex) => (
              <div
                key={`${hour}-${hour + 0.5}`}
                data-time={`${date.toISOString().split("T")[0]}:${hour}-${
                  hour + 0.5
                }`}
                data-row={hourIndex}
                data-col={dateIndex}
                className={`h-10 w-20 cursor-pointer transition-all ${
                  dateIndex !== dates.length - 1 ? "border-r" : ""
                } ${hourIndex !== hours.length - 1 ? "border-b" : ""} ${
                  selectedCells.includes(
                    `${date.toISOString().split("T")[0]}:${hour}-${hour + 0.5}`
                  )
                    ? "bg-indigo-500"
                    : ""
                }`}
                onPointerDown={(e) => initializeSave(e)}
                onPointerOver={(e) => onMouseOver(e)}
                onFocus={(e) => e} // TODO: add onFocus functionality for accessibility
                onPointerUp={() => onMouseUp()}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

export default AvailabilityGridWrite;
