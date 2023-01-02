// TODO: Redo this file to be /schedules/{slug}

import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import EventCard from "../../components/dashboard/EventCard";
import AvailabilitySection from "../../components/schedule/AvailabilitySection";
import PublishSection from "../../components/schedule/PublishSection";
import Share from "../../components/schedule/ShareModal";
import SuccessNotice from "../../components/schedule/SuccessNotice";
import BackArrow from "../../components/shared/BackArrow";

type Event = {
  id: string;
  scheduleName?: string;
  name?: string;
  date?: Date;
  start?: number;
  end?: number;
  location?: string;
  description?: string;
};

const events: Event[] = [
  // {
  //   id: "2",
  //   name: "User Testing Responses!",
  //   date: new Date("1/4/2022"),
  //   start: 1673128800,
  //   end: 1673139600,
  //   location: "Zoom Link",
  //   description:
  //     "Be ready with User Testing responses. We will discuss test outcomes and iterate over design",
  // },
  // {
  //   id: "3",
  //   name: "General",
  //   date: new Date("1/11/2022"),
  //   start: 1673736000,
  //   end: 1673744400,
  //   location: "Zoom Link",
  //   description: "Have revisions to design done.",
  // },
];

// TODO: implement correct noticeShown functionality on successful schedule create + publish
export const noticeShown = atom(false);
export const noticeMessage = atom("You have successfully created a schedule!");
export const sharePopupShown = atom(false);

function Schedule() {
  const eventSectionWidth = `w-[${events.length * 256 + 16 * events.length}px]`;
  const [isNoticeShown, setIsNoticeShown] = useAtom(noticeShown);
  const [isSharePopupShown, setIsSharePopupShown] = useAtom(sharePopupShown);

  useEffect(() => {
    if (isNoticeShown) {
      const interval = setInterval(() => {
        setIsNoticeShown(false);
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isNoticeShown]);

  return (
    <>
      {isSharePopupShown && (
        <div className="z-10">
          <Share />
          <div
            className="absolute left-0 top-0 h-full w-full bg-neutral-700 opacity-50"
            onClick={() => setIsSharePopupShown(false)}
          ></div>
        </div>
      )}
      <section className={isSharePopupShown ? "blur-md transition-all" : ""}>
        {isNoticeShown && <SuccessNotice />}
        <div className="px-8">
          <BackArrow href="/dashboard" page="Dashboard" />
          <header className="mb-8 mt-4 flex w-full items-start justify-between gap-2">
            <h1 className="text-3xl font-semibold">
              A Very Long Schedule Name Example
            </h1>
            <button
              className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
              onClick={() => setIsSharePopupShown(!isSharePopupShown)}
            >
              <FontAwesomeIcon icon={faShareFromSquare} />
              Share
            </button>
          </header>
          <div className="my-4">
            This will be the schedule for our bootcamp group’s meetings.
            Everyone should make sure to review the dates and locations before
            the events start.
          </div>
          <div className="z-10 mb-4 font-semibold">Hosted by: User</div>

          {events.length > 0 ? (
            <div className="overflow-x-auto overflow-y-hidden pb-6">
              <div className={`flex justify-between ${eventSectionWidth}`}>
                {events.map((event) => {
                  return (
                    <EventCard key={event.id} {...event} className="w-64" />
                  );
                })}
              </div>
              {/* {events.length > 1 && (
            <div className="my-4">
              <div className="w-8/12 rounded-full bg-neutral-300 p-1"></div>
            </div>
          )} */}
            </div>
          ) : (
            <div className="my-8 rounded-lg bg-neutral-700 p-4 text-center">
              <h4 className="mb-2 text-xl font-semibold">
                Waiting for Responses...
              </h4>
              <div>
                Click the Share button at the top to share this event to others!
              </div>
            </div>
          )}
        </div>

        <AvailabilitySection />
        <PublishSection />
      </section>
    </>
  );
}

export default Schedule;
