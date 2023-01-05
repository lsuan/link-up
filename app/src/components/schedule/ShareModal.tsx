import { faClose, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { notice, shareModalShown } from "../../pages/schedule/schedule";

function Share() {
  const [isShareModalShown, setIsShareModalShown] = useAtom(shareModalShown);
  const [, setNoticeMessage] = useAtom(notice);
  const scheduleLink = window.location.toString();

  useEffect(() => {
    window.onkeyup = (e) => {
      console.log(e.key);
      if (e.key === "Escape") {
        setIsShareModalShown(false);
      }
    };
  }, [isShareModalShown]);

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
      <button
        onClick={() => copyToClipboard()}
        className="w-full rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black"
      >
        <FontAwesomeIcon icon={faCopy} className="mr-2" />
        Copy to Clipboard
      </button>
    </div>
  );
}

export default Share;
