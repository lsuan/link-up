import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import Typography from "./Typography";

type Notice = {
  message: string;
  icon?: "check" | "alert";
};
export const notice = atom<Notice>({ message: "" });

// TODO: add more actions as needed
type SnackbarProps = {
  action: "close";
};

function Snackbar({ action }: SnackbarProps) {
  const [noticeMessage, setNoticeMessage] = useAtom(notice);

  const icons = {
    check: <FiCheckCircle />,
    alert: <FiAlertCircle />,
  };

  /** Object that acts as a map that gets the appropriate component based on the action */
  const actions = {
    close: (
      <FiX
        className="cursor-pointer text-base text-brand-200 transition-colors hover:text-white"
        onClick={() => setNoticeMessage({ message: "" })}
      />
    ),
  };

  // TODO: add animation on enter + leave
  useEffect(() => {
    if (noticeMessage.message !== "") {
      const interval = setInterval(() => {
        setNoticeMessage({ message: "" });
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [noticeMessage.message]);

  if (noticeMessage.message === "") {
    return null;
  }

  return (
    <div className="sticky bottom-6 left-6 z-50 flex w-full max-w-[22rem] items-center justify-between gap-2 rounded-lg bg-brand-700 p-4 font-medium text-white">
      <span>{icons[noticeMessage.icon as keyof typeof icons]}</span>
      <Typography className="w-full text-start text-white">
        {noticeMessage.message}
      </Typography>
      <span>{actions[action as keyof typeof actions]}</span>
    </div>
  );
}

export default Snackbar;
