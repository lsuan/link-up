import { useRef } from "react";
import {
  getHourNumber,
  type AvailabilityProps,
  type UserAvailability,
} from "../../utils/availabilityUtils";
import { getFormattedHours } from "../../utils/formUtils";
import { getShortenedDateWithDay } from "../../utils/timeUtils";
// import Loading from "../shared/Loading";
import AvailabilityGridRead from "./AvailabilityGridRead";
import AvailabilityGridWrite from "./AvailabilityGridWrite";

function AvailabilityGrid({ schedule, mode }: AvailabilityProps) {
  const { startDate, endDate, startTime, endTime, attendees } = schedule;
  const gridRef = useRef<HTMLDivElement>(null);
  // const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  // TODO: reimplement the loading state for rendering the grid
  // useEffect(() => {
  //   const grid = gridRef?.current;
  //   if (grid) {
  //     setIsGridLoading(false);
  //   }
  // }, [gridRef]);

  const getAllDates = () => {
    const dates: Date[] = [];
    for (
      let date = new Date(startDate), colIndex = 0;
      date <= endDate;
      date.setDate(date.getDate() + 1), colIndex++
    ) {
      dates.push(new Date(date));
    }
    return dates;
  };

  const startHour = getHourNumber(startTime);
  const endHour = getHourNumber(endTime);

  const getAllHours = () => {
    const hours = [...Array(endHour - startHour + 1).keys()].map(
      (i) => i + startHour
    );
    const timeSlots: number[] = [];
    hours.slice(0, hours.length - 1).forEach((hour) => {
      timeSlots.push(hour, hour + 0.5);
    });
    const endHourRange = hours[hours.length - 1] as number;
    timeSlots.push(endHourRange);
    return timeSlots;
  };

  const hours = getAllHours();
  const getAllFormattedHours = () => getFormattedHours(hours, "long");

  const dates = getAllDates();
  const formattedHours = getAllFormattedHours();

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
            {formattedHours.map((hour, index) => (
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
    </section>
  );
}

export default AvailabilityGrid;
