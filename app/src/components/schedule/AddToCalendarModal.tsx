import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { addToCalendarModal } from "../dashboard/EventCard";

function AddToCalendarModal() {
  const [isAddToCalendarModalShown, setIsAddToCalendarModalShown] =
    useAtom(addToCalendarModal);

  useEffect(() => {
    window.onkeyup = (e) => {
      console.log(e.key);
      if (e.key === "Escape") {
        setIsAddToCalendarModalShown(false);
      }
    };
  }, [isAddToCalendarModalShown]);

  return (
    <div className="absolute top-0 left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-500 bg-neutral-900 p-6 transition-all">
      <header className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">Add Event Name to Calendar</h2>
        <FontAwesomeIcon
          icon={faClose}
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
          onClick={() => setIsAddToCalendarModalShown(false)}
        />
      </header>
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-500 p-2">
        <FontAwesomeIcon icon={faGoogle} />
        Google Calendar
      </button>
    </div>
  );
}

export default AddToCalendarModal;
