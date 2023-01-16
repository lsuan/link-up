import { faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event, Schedule } from "@prisma/client";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { notice } from ".";
import ServerSideErrorMessage from "../../../components/form/ServerSideErrorMessage";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import EditEventCard from "../../../components/schedule/publish/EditEventCard";
import PublishEventCard from "../../../components/schedule/publish/PublishEventCard";
import BackArrow from "../../../components/shared/BackArrow";
import {
  categorizeUsers,
  getBestTimeBlock,
  getBestTimesPerDay,
  getHeuristics,
  getMostUsers,
  TimeBlock,
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
  className?: string;
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
  const [events, setEvents] = useState<InitialEventInfo[]>([]);
  const [saveWarning, setSaveWarning] = useState<string>("");

  useEffect(() => {
    if (events.every((event) => !event.isEditing)) {
      setSaveWarning("");
    }
  }, [events]);

  const setErrorBorder = () => {
    const eventsWithUnsavedEdits = events.map((event) => {
      if (event.isEditing) {
        return {
          ...event,
          className: "border border-red-500",
        };
      } else {
        return {
          ...event,
          className: "",
        };
      }
    });
    setEvents([...eventsWithUnsavedEdits]);
  };

  const initializeEvents = (data: Schedule | null) => {
    if (!data) {
      return;
    }
    const attendees = data.attendees as UserAvailability[];
    let lengthOfEvents = parseInt(data.lengthOfEvents.split(" ")[0] as string);
    if (lengthOfEvents === 30) {
      lengthOfEvents = 0.5;
    }
    const blockLength = lengthOfEvents * 2;
    const categorizedUsers = categorizeUsers(attendees);
    const mostUsers = getMostUsers(categorizedUsers);
    const bestTimes = getBestTimesPerDay(
      categorizedUsers,
      mostUsers,
      blockLength
    );

    if (!categorizedUsers || !bestTimes) {
      return;
    }
    const heuristics = getHeuristics(categorizedUsers, bestTimes);
    const initialEvents: InitialEventInfo[] = [];
    for (let i = 0; i < data.numberOfEvents; i++) {
      const timeBlock = getBestTimeBlock(
        bestTimes,
        heuristics,
        categorizedUsers,
        blockLength
      );

      if (!timeBlock) {
        return;
      }

      initialEvents.push({
        name: `Event ${i + 1}`,
        date: new Date(`${timeBlock.date}T00:00:00`),
        startTime: timeBlock.startTime,
        endTime: timeBlock.endTime,
        isEditing: false,
      });
    }
    setEvents([...initialEvents]);
  };

  const handlePublish = () => {
    if (events.some((event) => event.isEditing)) {
      setSaveWarning("You have unsaved events!");
      setErrorBorder();
    } else {
      setNoticeMessage("Your events have been successfully published!");

      router.push(`/schedule/${slug}`);
    }
  };

  const deleteEvent = (index: number) => {
    const newEvents = events.filter((_event, i) => i !== index);
    setEvents([...newEvents]);
  };

  const addEvent = () => {
    const newEvent: InitialEventInfo = {
      name: "New Event",
      date: null,
      startTime: schedule.data?.startTime as string,
      endTime: schedule.data?.endTime as string,
      isEditing: true,
      className: saveWarning !== "" ? "border border-red-500" : "",
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
            <div className="flex flex-col items-center gap-4">
              {events.map((event, index) => {
                return (
                  <div key={index} className="w-full">
                    {events[index]?.isEditing ? (
                      <EditEventCard
                        index={index}
                        events={events}
                        setEvents={setEvents}
                        deleteEvent={deleteEvent}
                        className={
                          event.className && event.className !== ""
                            ? ` ${event.className}`
                            : ""
                        }
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
              {saveWarning !== "" && (
                <div className="-mb-6 w-full">
                  <ServerSideErrorMessage error={saveWarning} />
                </div>
              )}
              <button
                className="w-full rounded-lg bg-neutral-500 p-2 hover:bg-neutral-300 hover:text-black"
                onClick={() => handlePublish()}
              >
                <FontAwesomeIcon icon={faListCheck} className="mr-2" />
                Confirm and Publish
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Publish;
