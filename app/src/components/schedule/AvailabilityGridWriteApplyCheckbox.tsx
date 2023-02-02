import { useAtom } from "jotai";
import { ChangeEvent, memo, SyntheticEvent, useRef, useState } from "react";
import { getShortenedDateWithDay } from "../../utils/timeUtils";
import { selected } from "./AvailabilityInput";

const AvailabilityGridWriteApplyCheckbox = memo(
  function AvailabilityGridWriteApplyCheckbox({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const [selectedCells, setSelectedCells] = useAtom(selected);
    const [isAvailabilityApplied, setIsAvailabilityApplied] =
      useState<boolean>(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
      const day = selectRef.current?.value;
      if (!isAvailabilityApplied && day && day !== "Select Day") {
        resetSelectedCells(day);
      }
      setIsAvailabilityApplied(!isAvailabilityApplied);
    };

    const handleSelectChange = (
      e: SyntheticEvent<HTMLSelectElement, Event>
    ) => {
      if (!isAvailabilityApplied) {
        return;
      }
      const dateOption = e.target as HTMLSelectElement;
      resetSelectedCells(dateOption.value);
    };

    const resetSelectedCells = (dateString: string) => {
      const selectedDayAvailability = selectedCells.filter((day) =>
        day.startsWith(dateString)
      );
      const selectedTimes = selectedDayAvailability.map(
        (day) => day.split(":")[1]
      );
      const newSelectedCells: string[] = [];
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        selectedTimes.forEach((time) => {
          newSelectedCells.push(`${dateString}:${time}`);
        });
      }
      setSelectedCells(newSelectedCells);
    };
    const days = [...selectedCells].map((day) => day.split(":")[0]!);
    const daysSet: Set<string> = new Set(days);
    const uniqueDays = [...daysSet].sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
      <section className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          name="applyAvailability"
          className="border border-neutral-500"
          checked={isAvailabilityApplied}
          onChange={handleCheck}
        />
        <label htmlFor="applyAvailability" className="text-sm">
          Autofill availability from
          <select
            ref={selectRef}
            className="ml-2 rounded-lg border border-neutral-500 bg-neutral-900 p-2"
            onChange={handleSelectChange}
          >
            <option>Select Day</option>
            {uniqueDays.map((day) => {
              return (
                <option key={day} value={day}>
                  {getShortenedDateWithDay(new Date(day))}
                </option>
              );
            })}
          </select>{" "}
        </label>
      </section>
    );
  }
);

export default AvailabilityGridWriteApplyCheckbox;
