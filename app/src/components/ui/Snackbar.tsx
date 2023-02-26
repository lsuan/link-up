import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const notice = atom("");

// add more actions as needed
type SnackbarProps = {
  action: "close";
};

function Snackbar({ action }: SnackbarProps) {
  const [noticeMessage, setNoticeMessage] = useAtom(notice);

  const actions = {
    close: (
      <FontAwesomeIcon
        icon={faClose}
        className="cursor-pointer text-base text-brand-200 transition-colors hover:text-white"
        onClick={() => setNoticeMessage("")}
      />
    ),
  };

  useEffect(() => {
    if (noticeMessage !== "") {
      const interval = setInterval(() => {
        setNoticeMessage("");
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  if (noticeMessage === "") {
    return null;
  }

  return (
    <div className="sticky bottom-6 left-6 z-50 flex w-full max-w-[22rem] items-center justify-between rounded-lg bg-brand-700 p-4 font-medium text-white">
      <span>
        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
        {noticeMessage}
      </span>
      {actions[action as keyof typeof actions]}
    </div>
  );
}

export default Snackbar;
