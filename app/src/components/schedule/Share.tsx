import { faClose, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import {
  noticeMessage,
  noticeShown,
  sharePopupShown,
} from "../../pages/schedule";

function Share() {
  const [, setIsSharePopupShown] = useAtom(sharePopupShown);
  const [, setNoticePopupMessage] = useAtom(noticeMessage);
  const [, setIsNoticeShown] = useAtom(noticeShown);
  const scheduleLink = window.location.toString();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scheduleLink);
    setIsSharePopupShown(false);
    setNoticePopupMessage("Copied to clipboard.");
    setIsNoticeShown(true);
  };

  return (
    <div className="sticky top-10 z-10 rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-500">
      <header className="flex justify-between">
        <h2 className="text-xl font-semibold">Share Schedule</h2>
        <FontAwesomeIcon
          icon={faClose}
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
          onClick={() => setIsSharePopupShown(false)}
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
