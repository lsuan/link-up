import {
  memo,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { type CalendarDays } from "../../utils/availabilityUtils";
import {
  TWENTY_FOUR_HOURS_MS,
  getShortenedDateWithDay,
} from "../../utils/timeUtils";

interface AvailabilityGridWriteApplyCheckboxProps {
  calendarDays: CalendarDays;
  selectedCells: CalendarDays;
  setSelectedCells: Dispatch<SetStateAction<CalendarDays>>;
}
/**
 * Renders the availability checkbox under the availability grid.
 * It controls the logic for displaying the current days for which
 * the user filled out availability.
 */
const AvailabilityGridWriteApplyCheckbox = memo(
  ({
    calendarDays,
    selectedCells,
    setSelectedCells,
  }: AvailabilityGridWriteApplyCheckboxProps) => {
    const [isAvailabilityApplied, setIsAvailabilityApplied] =
      useState<boolean>(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    const uniqueDays = useMemo(
      () => getUniqueDays(Object.keys(selectedCells)),
      [selectedCells]
    );

    /** Sets the user-facing options for the select dropdown. */
    const options = useMemo(
      () => [{ title: "Select Day" }, ...uniqueDays],
      [calendarDays, selectedCells]
    );

    /** Bases the schedule of every day from the chosen day. */
    const resetSelectedCells = (date: number) => {
      const newSelectedCells: CalendarDays = {};
      const selectedDateIndex = Object.keys(calendarDays).findIndex(
        (day) => day === date.toString()
      );

      Object.keys(calendarDays).forEach((day, dayIndex) => {
        newSelectedCells[Number(day)] = selectedCells[date]?.map((hour) => {
          if (dayIndex === selectedDateIndex) {
            return hour;
          }
          // subtract for previous days, add for future days
          return hour + (dayIndex - selectedDateIndex) * TWENTY_FOUR_HOURS_MS;
        })!;
      });

      setSelectedCells(newSelectedCells);
    };

    /** Fills in the availability table with the schedule of the chosen day. */
    const handleCheck = () => {
      const selected = selectRef.current?.value;
      if (!selected) {
        return;
      }
      const selectedDate = Number(selected);
      // if the option selected is not the default, then autofill the availability
      if (
        !isAvailabilityApplied &&
        options.find((option) => option.date && option.date === selectedDate)
      ) {
        resetSelectedCells(selectedDate);
      }
      setIsAvailabilityApplied((availability) => !availability);
    };

    /**
     * Handles the change of the select dropdown
     * if the checkbox was checked first and dropdown changed afterwards. */
    const handleSelectChange = (
      e: SyntheticEvent<HTMLSelectElement, Event>
    ) => {
      if (!isAvailabilityApplied) {
        return;
      }

      const dateOption = e.target as HTMLSelectElement;
      resetSelectedCells(Number(dateOption.value));
    };

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
            {options.map((option) => (
              <option key={option.title} value={option.date}>
                {option.title}
              </option>
            ))}
          </select>
        </label>
      </section>
    );
  }
);

/** The shape of the select that controls which date to set the availability schedule. */
interface CheckboxDropdownOption {
  /** `undefined` represents the default value ("Select Day.") */
  date?: number;
  title: string;
}

/** Gets only the unique days from the cells selected by the user. */
function getUniqueDays(selectedDays: string[]): CheckboxDropdownOption[] {
  return selectedDays.map((day) => {
    const date = Number(day);
    return {
      date,
      title: getShortenedDateWithDay(new Date(date)),
    };
  });
}

export default AvailabilityGridWriteApplyCheckbox;
