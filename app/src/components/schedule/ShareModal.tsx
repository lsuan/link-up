import Button from "@ui/Button";
import { notice } from "@ui/Snackbar";
import Typography from "@ui/Typography";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { FiCopy, FiX } from "react-icons/fi";

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
    setNoticeMessage({
      action: "close",
      icon: "check",
      message: "Copied to clipboard.",
    });
  };

  return (
    <div className="absolute top-0 left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-900 bg-neutral-300 p-6 transition-all">
      <header className="flex justify-between">
        <Typography intent="h2">Share Schedule</Typography>
        <FiX
          className="cursor-pointer text-neutral-500 transition-colors hover:text-black"
          onClick={() => setIsShareModalShown(false)}
        />
      </header>

      <div className="my-4 overflow-x-auto rounded-lg border border-neutral-900 px-4 py-2">
        {scheduleLink}
      </div>
      <Button onClick={() => copyToClipboard()} fullWidth>
        <FiCopy className="mr-2" />
        Copy to Clipboard
      </Button>
    </div>
  );
}

export default ShareModal;
