import { atom, useAtom } from "jotai";
import { useEffect, type MouseEventHandler, type ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import Typography from "./Typography";

// TODO: add more actions as needed
type Notice = {
  action: "close";
  message: string;
  icon?: "check" | "alert" | undefined;
};
// defaulting action to 'close'
export const notice = atom<Notice>({ message: "", action: "close" });

type MessageIconValue = Pick<Notice, "icon">["icon"];

/** Gets the appropriate accompanying icon for the message. */
const getMessageIcon = (icon: MessageIconValue): ReactNode => {
  switch (icon) {
    case "check":
      return <FiCheckCircle />;
    case "alert":
      return <FiAlertCircle />;
    default:
      return null;
  }
};

type ActionValue = Pick<Notice, "action">["action"];

/**
 * Sets the action for the snackbar.
 * Defaults to closing the snackbar.
 */
const getActionComponent = (
  action: ActionValue,
  onClick: MouseEventHandler<SVGElement> | undefined
): ReactNode => {
  switch (action) {
    case "close":
    default:
      return (
        <FiX
          className="cursor-pointer text-base text-brand-200 transition-colors hover:text-white"
          onClick={onClick}
          size="1.5rem"
        />
      );
  }
};

function Snackbar() {
  const [noticeMessage, setNoticeMessage] = useAtom(notice);
  const actionComponent = getActionComponent(noticeMessage.action, () =>
    setNoticeMessage({ message: "", action: noticeMessage.action })
  );
  const messageIcon = getMessageIcon(noticeMessage.icon);

  // TODO: add animation on enter + leave
  useEffect(() => {
    if (noticeMessage.message !== "") {
      const interval = setInterval(() => {
        setNoticeMessage({ message: "", action: noticeMessage.action });
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
    <div className="sticky bottom-6 left-6 z-50 flex w-full max-w-[22rem] items-center justify-between gap-2 rounded-lg bg-brand-500 p-4 font-medium text-white">
      <span>{messageIcon}</span>
      <Typography className="w-full text-start text-white">
        {noticeMessage.message}
      </Typography>
      <span>{actionComponent}</span>
    </div>
  );
}

export default Snackbar;
