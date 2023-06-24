import { useAtom } from "jotai";
import { memo, useRef, useState, type SyntheticEvent } from "react";
import { selected } from "../../utils/availabilityUtils";
import { getShortenedDateWithDay } from "../../utils/timeUtils";

/**
 * Renders the availability checkbox under the availability grid.
 * It controls the logic for displaying the current days for which
 * the user filled out availability.
 */
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

    const uniqueDays = getUniqueDays(selectedCells);

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
            {/* {uniqueDays.map((day) => (
              <option key={day} value={day}>
                {getShortenedDateWithDay(new Date(day))}
              </option>
            ))} */}
          </select>
        </label>
      </section>
    );
  }
);

/**
 * Everytime the user changes their availability, update the days
 * so that we can use it for the dropdown menu.
 */
function getUniqueDays(selectedCells: string[]) {
  console.log("selectedCells", selectedCells);

  // const uniqueDays = [...daysSet]?.sort(
  //   (a, b) => new Date(a).getTime() - new Date(b).getTime()
  // );
  // console.log("ud", uniqueDays);
}

export default AvailabilityGridWriteApplyCheckbox;
