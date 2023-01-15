import { faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event, Schedule } from "@prisma/client";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { notice } from ".";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import EditEventCard from "../../../components/schedule/publish/EditEventCard";
import PublishEventCard from "../../../components/schedule/publish/PublishEventCard";
import BackArrow from "../../../components/shared/BackArrow";
import {
  categorizeUsers,
  getBestTimes,
  getLeastUsers,
  getMostUsers,
  getTimeBlock,
  UserAvailability,
} from "../../../utils/availabilityUtils";
import { parseSlug } from "../../../utils/scheduleSlugUtils";
import { trpc } from "../../../utils/trpc";

export type InitialEventInfo = {
  name: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  isEditing: boolean;
};
function Publish() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { name, scheduleIdPart } = parseSlug(slug);
  const schedule = trpc.schedule.getScheduleFromSlugId.useQuery(
    {
      name: name,
      id: scheduleIdPart,
    },
    {
      enabled: sessionData?.user !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: (data) => initializeEvents(data),
    }
  );
  const [, setNoticeMessage] = useAtom(notice);
  const [isEditing, setIsEditing] = useState<boolean[]>([false]);
  const [events, setEvents] = useState<InitialEventInfo[]>([]);
  console.log(events);
  const initializeEvents = (data: Schedule | null) => {
    // const savedTimes = getSavedTimes(scheduleEvents);
    const attendees = data?.attendees as UserAvailability[];
    const categorizedUsers = categorizeUsers(attendees);
    const leastUsers = getLeastUsers(categorizedUsers, attendees?.length ?? 0);
    const mostUsers = getMostUsers(categorizedUsers);
    const bestTimes = getBestTimes(categorizedUsers, leastUsers, mostUsers);

    if (!data || !bestTimes) {
      return;
    }

    const initEvents: InitialEventInfo[] = [];
    for (let i = 0; i < data.numberOfEvents - initEvents.length; i++) {
      const length = parseInt(data.lengthOfEvents.split(" ")[0] as string);
      const [date, startTime, endTime] = getTimeBlock(bestTimes, length) as [
        date: string,
        startTime: string,
        endTime: string
      ];

      initEvents.push({
        name: `Event ${i + 1}`,
        date: new Date(`${date}T00:00:00`),
        startTime,
        endTime,
        isEditing: false,
      });
    }
    setEvents([...initEvents]);
  };

  const handlePublish = () => {
    setNoticeMessage("Your events have been successfully published!");
    router.push(`/schedule/${slug}`);
  };

  // TODO: implement deleting + adding an event
  const deleteEvent = (index: number) => {
    const newEvents = events.filter((_event, i) => {
      i === index;
    });
    setEvents([...newEvents]);
  };

  const addEvent = () => {
    const newEvent: InitialEventInfo = {
      name: "New Event",
      date: null,
      startTime: schedule.data?.startTime as string,
      endTime: schedule.data?.endTime as string,
      isEditing: true,
    };
    setEvents([...events, newEvent]);
  };

  // FIXME: events are not properly set on load
  return (
    <>
      <section className="px-8">
        <BackArrow href={`/schedule/${slug}`} page="Schedule" />
        <h1 className="mb-12 text-3xl font-semibold">Publish Event(s)</h1>
        {schedule.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <AvailabilityResponses schedule={schedule.data!} />
            <h3 className="mt-8 mb-4 font-semibold">
              {`These are the best times based on your preferences (${
                schedule.data?.numberOfEvents
              } ${schedule.data?.numberOfEvents === 1 ? "event" : "events"}, ${
                schedule.data?.lengthOfEvents
              } ${schedule.data?.numberOfEvents === 1 ? "long" : "each"}):`}
            </h3>
            <div className="my-4 flex flex-col items-center gap-4">
              {events.map((event, index) => {
                return (
                  <div key={index} className="w-full">
                    {events[index]?.isEditing ? (
                      <EditEventCard
                        index={index}
                        events={events}
                        setEvents={setEvents}
                        deleteEvent={deleteEvent}
                      />
                    ) : (
                      <PublishEventCard
                        index={index}
                        events={events}
                        setEvents={setEvents}
                        deleteEvent={deleteEvent}
                      />
                    )}
                  </div>
                );
              })}
              <button
                className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
                onClick={() => addEvent()}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button
              className="mt-12 w-full rounded-lg bg-neutral-500 p-2 hover:bg-neutral-300 hover:text-black"
              onClick={() => handlePublish()}
            >
              <FontAwesomeIcon icon={faListCheck} className="mr-2" />
              Confirm and Publish
            </button>
          </>
        )}
      </section>
    </>
  );
}

export default Publish;
