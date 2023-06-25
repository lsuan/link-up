import { type Schedule } from "@prisma/client";
import { notice } from "@ui/Snackbar";
import { cva } from "cva";
import { useAtom } from "jotai";
import React, {
  memo,
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  disabled,
  handleCellAvailability,
  isCellSelected,
  type CalendarDays,
} from "../../utils/availabilityUtils";
import { THIRTY_MINUTES_MS } from "../../utils/timeUtils";
import AvailabilityGridWriteApplyCheckbox from "./AvailabilityGridWriteApplyCheckbox";

interface StartCoordinates {
  clientX: number;
  clientY: number;
  row: number;
  col: number;
}

interface AvailabilityGridWriteProps {
  calendarDays: CalendarDays;
  // selectedCells: number[];
  // setSelectedCells: Dispatch<SetStateAction<number[]>>;
  selectedCells: CalendarDays;
  setSelectedCells: Dispatch<SetStateAction<CalendarDays>>;
}

const cellStyles = cva("h-10 w-20 cursor-pointer border transition-all", {
  variants: {
    intent: {
      filled: "bg-indigo-500",
      empty: "bg-white",
    },
  },
});

const AvailabilityGridWrite = memo(
  ({
    calendarDays,
    selectedCells,
    setSelectedCells,
  }: AvailabilityGridWriteProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [, setIsDisabled] = useAtom(disabled);
    // const [selectedCells, setSelectedCells] = useAtom(selected);
    const [, setNoticeMessage] = useAtom(notice);
    const [startCoordinates, setStartCoordinates] =
      useState<StartCoordinates>();
    const [neighbors, setNeighbors] = useState<CalendarDay[]>();
    // const [neighbors, setNeighbors] = useState<Set<HTMLDivElement>>(new Set());

    // const updateGrid = (
    //   currentNeighbors: Set<HTMLDivElement>,
    //   rowIndex: number,
    //   colIndex: number
    // ) => {
    //   const neighbor = document.querySelector(
    //     `div[data-row='${rowIndex}'][data-col='${colIndex}']`
    //   ) as HTMLDivElement;
    //   const neighborTimeKey = neighbor.getAttribute("data-time") as string;

    //   selectedCells.includes(neighborTimeKey)
    //     ? neighbor.classList.remove("bg-indigo-500")
    //     : neighbor.classList.add("bg-indigo-500");

    //   currentNeighbors.add(neighbor);
    // };

    // const initializeSave = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   setIsEditing(true);
    //   setIsDisabled(false);
    //   setNoticeMessage({ action: "close", message: "" });
    //   const cell = e.target as HTMLDivElement;
    //   const row = parseInt(cell.getAttribute("data-row") as string);
    //   const col = parseInt(cell.getAttribute("data-col") as string);
    //   setStartCoordinates({ clientX: e.clientX, clientY: e.clientY, row, col });
    //   setNeighbors(new Set([cell]));
    //   updateGrid(neighbors, row, col);
    // };

    // // FIXME: need to be able to get rid of previous cells while editing
    // // keep track of when the mouse direction goes the opposite way
    // const onPointerOver = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   if (!isEditing || !startCoordinates) {
    //     return;
    //   }

    //   const currentCell = e.target as HTMLDivElement;
    //   const currentX = e.clientX;
    //   const currentY = e.clientY;
    //   const currentRow = parseInt(
    //     currentCell.getAttribute("data-row") as string
    //   );
    //   const currentCol = parseInt(
    //     currentCell.getAttribute("data-col") as string
    //   );
    //   const {
    //     clientX: startX,
    //     clientY: startY,
    //     row: startRow,
    //     col: startCol,
    //   } = startCoordinates;

    //   const currentNeighbors = new Set<HTMLDivElement>([...neighbors]);
    //   if (currentY < startY && currentX < startX) {
    //     // going up left
    //     for (let rowIndex = startRow; rowIndex >= currentRow; rowIndex--) {
    //       for (let colIndex = startCol; colIndex >= currentCol; colIndex--) {
    //         updateGrid(currentNeighbors, rowIndex, colIndex);
    //       }
    //     }
    //   } else if (currentY < startY && currentX > startX) {
    //     // going up right
    //     for (let rowIndex = startRow; rowIndex >= currentRow; rowIndex--) {
    //       for (let colIndex = startCol; colIndex <= currentCol; colIndex++) {
    //         updateGrid(currentNeighbors, rowIndex, colIndex);
    //       }
    //     }
    //   } else if (currentY > startY && currentX < startX) {
    //     // going down left
    //     for (let rowIndex = startRow; rowIndex <= currentRow; rowIndex++) {
    //       for (let colIndex = startCol; colIndex >= currentCol; colIndex--) {
    //         updateGrid(currentNeighbors, rowIndex, colIndex);
    //       }
    //     }
    //   } else if (currentY > startY && currentX > startX) {
    //     // going down right
    //     for (let rowIndex = startRow; rowIndex <= currentRow; rowIndex++) {
    //       for (let colIndex = startCol; colIndex <= currentCol; colIndex++) {
    //         updateGrid(currentNeighbors, rowIndex, colIndex);
    //       }
    //     }
    //   } else {
    //     updateGrid(currentNeighbors, currentRow, currentCol);
    //   }

    //   setNeighbors(new Set([...currentNeighbors]));
    // };

    // const onPointerUp = () => {
    //   let timeKeys: CalendarDay[] = [...selectedCells];
    //   neighbors.forEach((neighbor) => {
    //     const currentTimeKey = neighbor?.getAttribute("data-time") as string;
    //     // timeKeys.filter((timeKey) => timeKey === currentTimeKey);
    //     if (selectedCells.includes(currentTimeKey)) {
    //       timeKeys = timeKeys.filter((timeKey) => timeKey !== currentTimeKey);
    //     } else {
    //       timeKeys.push(currentTimeKey);
    //     }
    //   });
    //   setIsEditing(false);
    //   setSelectedCells([...timeKeys]);
    //   if (timeKeys.length === 0) {
    //     setIsDisabled(true);
    //   }
    //   setNeighbors(new Set());
    //  };

    /** Starts up edit mode so the user can drag on the grid. */
    const onPointerDown = (currentDate: string, currentHour: number) => {
      setIsEditing(true);
      setSelectedCells((prev) =>
        handleCellAvailability(prev, currentDate, currentHour)
      );
    };

    const onPointerOver = useCallback(
      (day: string, hour: number) => {
        if (!isEditing) {
          return;
        }
        setSelectedCells((prev) => handleCellAvailability(prev, day, hour));
      },
      [isEditing]
    );

    const onPointerUp = () => {
      setIsEditing(false);
    };

    // currently just handling blocks as the start time
    // just remember for user-facing details to add thirty minutes to the end time
    return (
      <div className="flex overflow-hidden rounded-lg border">
        {Object.entries(calendarDays).map(([day, hours]) => (
          <div
            key={day}
            className="flex flex-col"
            // data-date={
            //   new Date(date.toDateString()).toISOString().split("T")[0]
            // }
          >
            {hours.map((hour, hourIndex) => (
              <div
                key={hour}
                // data-time={hour}
                // data-row={hourIndex}
                // data-col={dayIndex}
                className={cellStyles({
                  intent: isCellSelected(selectedCells, day, hour)
                    ? "filled"
                    : "empty",
                })}
                onPointerDown={() => onPointerDown(day, hour)}
                onPointerEnter={() => onPointerOver(day, hour)}
                onFocus={(e) => e} // TODO: add onFocus functionality for accessibility
                onPointerUp={onPointerUp}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);

export default AvailabilityGridWrite;
