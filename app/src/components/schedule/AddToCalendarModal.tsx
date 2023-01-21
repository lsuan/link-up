import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { ScheduleEventCardProps } from "../schedule/ScheduleEventCard";

function AddToCalendarModal({
  name,
  date,
  startTime,
  endTime,
  location,
  description,
  index,
  isAddToCalendarModalShown,
  setIsAddToCalendarModalShown,
}: ScheduleEventCardProps) {
  const handleModalClose = () => {
    const prev = isAddToCalendarModalShown.slice(0, index);
    const rest = isAddToCalendarModalShown.slice(index + 1);
    setIsAddToCalendarModalShown([...prev, false, ...rest]);
  };
  useEffect(() => {
    window.onkeyup = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };
  }, [isAddToCalendarModalShown]);

  return (
    <div className="absolute top-0 left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-500 bg-neutral-900 p-6 transition-all">
      <header className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">{`Add ${name} to Calendar`}</h2>
        <FontAwesomeIcon
          icon={faClose}
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
          onClick={() => handleModalClose()}
        />
      </header>
      <button className="hover:text-blacke flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300">
        <FontAwesomeIcon icon={faGoogle} />
        Google Calendar
      </button>
    </div>
  );
}

export default AddToCalendarModal;
