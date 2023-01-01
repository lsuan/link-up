import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { noticeMessage, noticeShown } from "../../pages/schedule";

function SuccessNotice() {
  const [, setIsNoticeShown] = useAtom(noticeShown);
  const [noticePopupMessage] = useAtom(noticeMessage);
  return (
    <div className="sticky top-0 -mt-8 flex w-full justify-between bg-neutral-900 p-4 shadow-md shadow-neutral-700">
      <div className="text-sm">
        <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-700" />
        {noticePopupMessage}
      </div>
      <FontAwesomeIcon
        icon={faClose}
        className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
        onClick={() => setIsNoticeShown(false)}
      />
    </div>
  );
}

export default SuccessNotice;
