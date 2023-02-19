import { faCheckCircle, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { notice } from "../../pages/schedule/[slug]";

function SuccessNotice() {
  const [noticeMessage, setNoticeMessage] = useAtom(notice);

  useEffect(() => {
    if (noticeMessage !== "") {
      const interval = setInterval(() => {
        setNoticeMessage("");
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [noticeMessage, setNoticeMessage]);

  return (
    <>
      {noticeMessage !== "" && (
        <div className="sticky top-0 z-10 -mt-8 flex w-full justify-between bg-neutral-900 p-4 shadow-md shadow-neutral-700">
          <div className="text-sm">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mr-2 text-green-700"
            />
            {noticeMessage}
          </div>
          <FontAwesomeIcon
            icon={faClose}
            className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
            onClick={() => setNoticeMessage("")}
          />
        </div>
      )}
    </>
  );
}

export default SuccessNotice;
