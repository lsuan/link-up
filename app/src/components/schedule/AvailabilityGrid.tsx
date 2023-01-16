import { getHourNumber, UserAvailability } from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import AvailabilityGridRead from "./AvailabilityGridRead";
import AvailabilityGridWrite from "./AvailabilityGridWrite";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityGrid({ schedule, mode }: AvailabilityProps) {
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

  const getAllHours = () => {
    const hours = [...Array(endHour - startHour + 1).keys()].map(
      (i) => i + startHour
    );
    let timeSlots: number[] = [];
    hours.slice(0, hours.length - 1).forEach((hour) => {
      timeSlots.push(hour, hour + 0.5);
    });
    timeSlots.push(hours[hours.length - 1]!);
    return timeSlots;
  };

  const hours = getAllHours();
  const getAllFormattedHours = () => {
    return getFormattedHours(hours, "long");
  };

  const dates = getAllDates(),
    formattedHours = getAllFormattedHours();

  return (
    <>
      <div className="horizontal-scrollbar relative my-4 grid place-items-center overflow-x-scroll pb-4">
        <div className="sticky top-0 flex w-full justify-evenly">
          <div className="w-12 px-2" />
          {dates.map((date: Date) => {
            return (
              <label
                key={date.toDateString()}
                className="pointer-events-none select-none pb-2 text-center text-xs font-semibold"
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
          <div className="sticky left-0 -mt-2 flex flex-col bg-inherit pr-2">
            {formattedHours.map((hour, index) => {
              return (
                <label
                  key={hour}
                  className={`pointer-events-none mx-auto w-max text-xs font-semibold ${
                    index < hours.length - 1
                      ? "h-10"
                      : "absolute -bottom-2 left-1"
                  }`}
                >
                  {hour}
                </label>
              );
            })}
          </div>
          {mode === "read" ? (
            <AvailabilityGridRead
              dates={dates}
              hours={hours.slice(0, hours.length - 1)}
              attendees={attendees as UserAvailability[]}
            />
          ) : (
            <AvailabilityGridWrite
              dates={dates}
              hours={hours.slice(0, hours.length - 1)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AvailabilityGrid;
