import {
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  getHourNumber,
  type AvailabilityProps,
  type CalendarDays,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import {
  USER_TIMEZONE,
  convertTime,
  getShortenedDateWithDay,
} from "../../utils/timeUtils";
// import Loading from "../shared/Loading";
import { type Schedule } from "@prisma/client";
import AvailabilityGridRead from "./AvailabilityGridRead";
import AvailabilityGridWrite from "./AvailabilityGridWrite";
import AvailabilityGridWriteApplyCheckbox from "./AvailabilityGridWriteApplyCheckbox";

/** Gets all the dates in a date range. */
function getAllDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  for (
    let date = new Date(startDate), colIndex = 0;
    date <= endDate;
    date.setDate(date.getDate() + 1), colIndex++
  ) {
    dates.push(new Date(date));
  }
  return dates;
}

/**
 * Given a start time and end time, gets all the 30 minute time blocks in between.
 * Returns a list of numbers representing the time slots in milliseconds.
 */

// TODO: see if this can be refactored to use THIRTY_MINUTES_MS instead
function getAllCalendarDays(
  dates: Date[],
  startHour: string,
  endHour: string
): CalendarDays {
  const calendarDays: CalendarDays = {};

  dates.forEach((date) => {
    const startTime = getHourNumber(startHour);
    const endTime = getHourNumber(endHour);
    const dailyTimeSlots: number[] = [];
    for (
      let currentTime = startTime;
      currentTime <= endTime;
      currentTime += 0.5
    ) {
      const dateString = date.toISOString().split("T")[0];
      const formattedTime = getFormattedHours([currentTime], "long")[0]!.split(
        " "
      )[0];
      const currentDatetime = new Date(`${dateString} ${formattedTime}:00`);
      dailyTimeSlots.push(currentDatetime.getTime());
    }
    calendarDays[date.getTime()] = dailyTimeSlots;
  });

  return calendarDays;
}

/** Used to get a list of hour labels, converted to the user's timezone. */
function getHourLabels(
  calendarDays: CalendarDays,
  fromTimezone: string
): string[] {
  const hourBlocks = Object.values(calendarDays)[0];
  if (hourBlocks === undefined || hourBlocks?.length === 0) {
    return [];
  }
  return hourBlocks.map((time) => {
    const date = new Date(time);
    const convertedDate = convertTime(fromTimezone, USER_TIMEZONE, date);
    return convertedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
  });
}

type AvailabilityGridProps = {
  schedule: Schedule;
} & (ReadMode | WriteMode);

interface ReadMode {
  mode: "read";
  selectedCells: undefined;
  setSelectedCells: undefined;
}
interface WriteMode {
  mode: "write";
  selectedCells: CalendarDays;
  setSelectedCells: Dispatch<SetStateAction<CalendarDays>>;
}

function AvailabilityGrid({
  schedule,
  mode,
  selectedCells,
  setSelectedCells,
}: AvailabilityGridProps) {
  const { startDate, endDate, startTime, endTime } = schedule;
  const gridRef = useRef<HTMLDivElement>(null);
  // const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  // TODO: reimplement the loading state for rendering the grid
  // useEffect(() => {
  //   const grid = gridRef?.current;
  //   if (grid) {
  //     setIsGridLoading(false);
  //   }
  // }, [gridRef]);

  const dates = getAllDates(startDate, endDate);
  const calendarDays = getAllCalendarDays(dates, startTime, endTime);
  const hours = getHourLabels(calendarDays, schedule.timezone);

  return (
    <section className="availability-container">
      <div
        className="horizontal-scrollbar relative my-4 grid place-items-center overflow-x-scroll pb-4"
        ref={gridRef}
      >
        <div className="relative flex w-full justify-end">
          {dates.map((date: Date) => (
            <span
              key={date.toDateString()}
              className="pointer-events-none w-20 select-none pb-2 text-center text-xs font-semibold"
            >
              {getShortenedDateWithDay(date)}
            </span>
          ))}
        </div>
        <div className="border-grey-500 flex w-fit pl-1">
          <div className="sticky left-0 z-10 -mt-2 mr-2 flex flex-col bg-inherit">
            {hours.map((hour, index) => (
              <span
                key={hour}
                className={`pointer-events-none mx-auto w-max text-xs font-semibold ${
                  index < hours.length - 1
                    ? "h-10"
                    : "absolute -bottom-[0.45rem] left-1/2 -translate-x-1/2"
                }`}
              >
                {hour}
              </span>
            ))}
          </div>
          {mode === "read" && (
            <AvailabilityGridRead
              scheduleId={schedule.id}
              calendarDays={calendarDays}
            />
          )}
          {mode === "write" && (
            <AvailabilityGridWrite
              calendarDays={calendarDays}
              selectedCells={selectedCells}
              setSelectedCells={setSelectedCells}
            />
          )}
        </div>
      </div>
      {Object.keys(calendarDays).length > 1 && mode === "write" && (
        <AvailabilityGridWriteApplyCheckbox
          calendarDays={calendarDays}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
        />
      )}
    </section>
  );
}

export default AvailabilityGrid;
