// TODO: Redo this file to be /schedules/{slug}

import {
  faListCheck,
  faPenToSquare,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import EventCard from "../components/dashboard/EventCard";
import SuccessNotice from "../components/schedule/SuccessNotice";
import BackArrow from "../components/shared/BackArrow";

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

export const noticeShown = atom(true);

function Schedule() {
  const eventSectionWidth = `w-[${events.length * 256 + 16 * events.length}px]`;
  const [isNoticeShown, setIsNoticeShown] = useAtom(noticeShown);

  useEffect(() => {
    if (isNoticeShown) {
      const interval = setInterval(() => {
        setIsNoticeShown(false);
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <section>
      {isNoticeShown && <SuccessNotice action="created" />}
      <div className="px-8">
        <BackArrow />
        <header className="mb-8 mt-4 flex w-full items-start justify-between gap-2">
          <h1 className="text-3xl font-semibold">
            A Very Long Schedule Name Example
          </h1>
          <button className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-300 hover:text-blue-700">
            <FontAwesomeIcon icon={faShareFromSquare} />
            Share
          </button>
        </header>
        <div className="my-4">
          This will be the schedule for our bootcamp group’s meetings. Everyone
          should make sure to review the dates and locations before the events
          start.
        </div>
        <div className="z-10 mb-4 font-semibold">Hosted by: User</div>

        {events.length > 0 ? (
          <div className="overflow-x-auto overflow-y-hidden pb-6">
            <div className={`flex justify-between ${eventSectionWidth}`}>
              {events.map((event) => {
                return <EventCard key={event.id} {...event} className="w-64" />;
              })}
            </div>
            {/* {events.length > 1 && (
            <div className="my-4">
              <div className="w-8/12 rounded-full bg-neutral-300 p-1"></div>
            </div>
          )} */}
          </div>
        ) : (
          <div className="my-8 rounded-lg bg-neutral-500 p-4 text-center">
            <h4 className="font-semibol mb-2 text-xl">
              Waiting for Responses...
            </h4>
            <div className="">
              Click the Share button at the top to share this event to others!
            </div>
          </div>
        )}
      </div>

      <div className="my-8 w-full bg-neutral-500 py-8 px-8">
        <h2 className="mb-8 rounded-lg text-3xl font-semibold">Availability</h2>
        <button className="w-full rounded-lg border border-white bg-neutral-900 p-2 transition-colors hover:bg-neutral-700">
          <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
          Add/Edit Availability
        </button>
      </div>
      <div className="my-8 w-full px-8">
        <h3 className="mb-4 text-3xl font-semibold">
          Ready to finalize dates and times?
        </h3>
        <button className="w-full rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black">
          <FontAwesomeIcon icon={faListCheck} className="mr-2" />
          Publish Event(s)
        </button>
      </div>
    </section>
  );
}

export default Schedule;
