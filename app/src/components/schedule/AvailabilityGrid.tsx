import { atom } from "jotai";
import {
  getHourNumber,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { getFormattedHours } from "../../utils/formUtils";
import AvailabilityGridRead from "./AvailabilityGridRead";
import AvailabilityGridWrite from "./AvailabilityGridWrite";
import { AvailabilityProps } from "./AvailabilitySection";

export const hoverInfo = atom<string[]>([]);

function AvailabilityGrid({
  schedule,
  scheduleQuery,
  mode,
}: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime, attendees } = schedule;

  const getAllDates = () => {
    let dates = [];
    for (
      let date = new Date(startDate), colIndex = 0;
      date < endDate;
      date.setDate(date.getDate() + 1), colIndex++
    ) {
      dates.push(new Date(date));
    }
    return dates;
  };

  const startHour = getHourNumber(startTime),
    endHour = getHourNumber(endTime);
  const hours = [...Array(endHour - startHour + 1).keys()].map(
    (i) => i + startHour
  );
  const getAllFormattedHours = () => {
    const allHours = hours;
    return getFormattedHours(allHours, "short");
  };

  const dates = getAllDates(),
    formattedHours = getAllFormattedHours();

  return (
    <>
      <div className="horizontal-scrollbar relative mt-4 mb-6 grid place-items-center overflow-x-scroll pb-4">
        <div className="sticky top-0 flex w-fit justify-center">
          <div className="w-12 px-2" />
          {dates.map((date: Date) => {
            return (
              <label
                key={date.toDateString()}
                className="pointer-events-none w-20 select-none pb-2 text-center text-xs font-semibold"
              >
                {new Intl.DateTimeFormat("en-us", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                }).format(date)}
              </label>
            );
          })}
        </div>
        <div className="border-grey-500 flex w-fit pl-1">
          <div className="sticky left-0 flex w-12 flex-col items-center justify-between gap-3 bg-inherit px-2">
            {formattedHours.map((hour) => {
              return (
                <label
                  key={hour}
                  className="pointer-events-none flex w-max items-start justify-center text-xs font-semibold"
                >
                  {hour}
                </label>
              );
            })}
          </div>
          {mode === "read" ? (
            <AvailabilityGridRead
              dates={dates}
              hours={hours}
              attendees={attendees as UserAvailability[]}
            />
          ) : (
            <AvailabilityGridWrite
              dates={dates}
              hours={hours}
              schedule={schedule}
              scheduleQuery={scheduleQuery}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AvailabilityGrid;
