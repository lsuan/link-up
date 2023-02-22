import { faClose, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@ui/Button";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { notice } from "./SuccessNotice";

export const shareModalShown = atom(false);
function ShareModal() {
  const [, setIsShareModalShown] = useAtom(shareModalShown);
  const [, setNoticeMessage] = useAtom(notice);
  const scheduleLink = window.location.toString();

  useEffect(() => {
    window.onkeyup = (e) => {
      if (e.key === "Escape") {
        setIsShareModalShown(false);
      }
    };
  }, [setIsShareModalShown]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scheduleLink);
    setIsShareModalShown(false);
    setNoticeMessage("Copied to clipboard.");
  };

  return (
    <div className="absolute top-0 left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-500 bg-neutral-900 p-6 transition-all">
      <header className="flex justify-between">
        <h2 className="text-xl font-semibold">Share Schedule</h2>
        <FontAwesomeIcon
          icon={faClose}
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
          onClick={() => setIsShareModalShown(false)}
        />
      </header>

      <div className="my-4 overflow-x-auto rounded-lg border border-neutral-500 px-4 py-2">
        {scheduleLink}
      </div>
      <Button onClick={() => copyToClipboard()} fullWidth>
        <FontAwesomeIcon icon={faCopy} className="mr-2" />
        Copy to Clipboard
      </Button>
    </div>
  );
}

export default ShareModal;
