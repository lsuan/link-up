import Button from "@ui/Button";
import { notice } from "@ui/Snackbar";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import Typography from "@ui/Typography";
import { type InitialEventInfo } from "../../pages/schedule/[slug]/publish";

export const deleteWarningModalShown = atom(false);

function DeleteWarningModal({
  index,
  events,
  deleteEvent,
  isDeleteWarningModalShown,
  setIsDeleteWarningModalShown,
}: {
  index: number;
  events: InitialEventInfo[];
  deleteEvent: (index: number) => void;
  isDeleteWarningModalShown: boolean[];
  setIsDeleteWarningModalShown: (state: boolean[]) => void;
}) {
  const [, setNoticeMessage] = useAtom(notice);
  const handleModalClose = useCallback(() => {
    const prev = isDeleteWarningModalShown.slice(0, index);
    const rest = isDeleteWarningModalShown.slice(index + 1);
    setIsDeleteWarningModalShown([...prev, false, ...rest]);
  }, [index, setIsDeleteWarningModalShown, isDeleteWarningModalShown]);

  useEffect(() => {
    window.onkeyup = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };
  }, [handleModalClose, isDeleteWarningModalShown]);

  const handleRemove = () => {
    deleteEvent(index);
    handleModalClose();
    setNoticeMessage({
      action: "close",
      icon: "check",
      message: "Event has been removed.",
    });
  };

  const event = events[index] as InitialEventInfo;

  return (
    <div className="absolute left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-900 bg-neutral-300 p-6 transition-all">
      <header className="flex justify-between">
        <Typography intent="h2">Remove {event.name}</Typography>
        <FiX
          className="cursor-pointer text-neutral-500 transition-colors hover:text-black"
          onClick={() => handleModalClose()}
        />
      </header>

      <div className="my-4 overflow-x-auto px-4 py-2">
        Are you sure you want to remove this event?
      </div>
      <Button onClick={() => handleRemove()} fullWidth>
        <FiTrash2 className="mr-2" />
        Yes, remove
      </Button>
      <Button onClick={() => handleModalClose()} intent="secondary" fullWidth>
        No
      </Button>
    </div>
  );
}

export default DeleteWarningModal;
