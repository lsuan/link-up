import { useAtom } from "jotai";
import { memo, useRef, useState, type SyntheticEvent } from "react";
import { selected } from "../../utils/availabilityUtils";
import { getShortenedDateWithDay } from "../../utils/timeUtils";

const AvailabilityGridWriteApplyCheckbox = memo(
  ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
    const [selectedCells, setSelectedCells] = useAtom(selected);
    const [isAvailabilityApplied, setIsAvailabilityApplied] =
      useState<boolean>(false);
    const selectRef = useRef<HTMLSelectElement>(null);

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
        const currentDateString = date.toISOString().split("T")[0];
        selectedTimes?.forEach((time) => {
          newSelectedCells.push(`${currentDateString}:${time}`);
        });
      }
      setSelectedCells(newSelectedCells);
    };

    const handleCheck = () => {
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

    const days = [...selectedCells].map((day) => day.split(":")[0]) as string[];
    const daysSet: Set<string> = new Set(days);
    const uniqueDays = [...daysSet]?.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // don't show checkbox if it's a one day schedule
    if (startDate.getTime() === endDate.getTime()) {
      return null;
    }

    return (
      <section className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          name="applyAvailability"
          className="border border-neutral-500"
          checked={isAvailabilityApplied}
          onChange={() => handleCheck()}
        />
        <label htmlFor="applyAvailability" className="text-sm">
          Autofill availability from
          <select
            ref={selectRef}
            className="ml-2 rounded-lg border border-neutral-900 bg-white p-2"
            onChange={handleSelectChange}
          >
            <option>Select Day</option>
            {uniqueDays.map((day) => (
              <option key={day} value={day}>
                {getShortenedDateWithDay(new Date(day))}
              </option>
            ))}
          </select>
        </label>
      </section>
    );
  }
);

export default AvailabilityGridWriteApplyCheckbox;
