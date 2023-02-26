import { faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Schedule } from "@prisma/client";
import Button from "@ui/Button";
import { notice } from "@ui/Snackbar";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ServerSideErrorMessage from "../../../components/form/ServerSideErrorMessage";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import EditEventCard from "../../../components/schedule/publish/EditEventCard";
import PublishEventCard from "../../../components/schedule/publish/PublishEventCard";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import Unauthenticated from "../../../components/shared/Unauthenticated";
import { useSchedule } from "../../../hooks/scheduleHooks";
import {
  categorizeUsers,
  getBestTimeBlock,
  getBestTimesPerDay,
  getHeuristics,
  getHourNumber,
  getMostUsers,
  type TimeBlock,
  type UserAvailability,
} from "../../../utils/availabilityUtils";
import { trpc } from "../../../utils/trpc";

export type InitialEventInfo = {
  name: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  isEditing?: boolean;
  className?: string;
  scheduleId?: string;
};

// OPTIMIZE: might want to get rid of className option and create refs instead for error border?
function Publish() {
  const { status } = useSession();
  const router = useRouter();
  const [, setNoticeMessage] = useAtom(notice);
  const [events, setEvents] = useState<InitialEventInfo[]>([]);
  const [saveWarning, setSaveWarning] = useState<string>("");

  const initializeEvents = (data: Schedule | null) => {
    if (!data) {
      return;
    }

    let lengthOfEvents = parseInt(data.lengthOfEvents.split(" ")[0] as string);
    if (lengthOfEvents === 30) {
      lengthOfEvents = 0.5;
    }
    const categorizedUsers = categorizeUsers(
      data.attendees as UserAvailability[]
    );
    const blockLength = lengthOfEvents * 2;
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
      const timeBlock: TimeBlock = getBestTimeBlock(
        bestTimes,
        heuristics,
        categorizedUsers,
        blockLength
      ) as TimeBlock;

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

  const { schedule, isScheduleLoading, slug } = useSchedule(
    router,
    initializeEvents
  );
  const { mutateAsync, isLoading: isCreateEventsLoading } =
    trpc.event.createEvents.useMutation();

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
      }
      return {
        ...event,
        className: "",
      };
    });
    setEvents([...eventsWithUnsavedEdits]);
  };

  const handlePublish = async () => {
    if (events.some((event) => event.isEditing)) {
      setSaveWarning("You have unsaved events!");
      setErrorBorder();
    } else {
      setNoticeMessage("Your events have been successfully published!");
      const eventData = events.map((event) => {
        type NewEvent = Omit<InitialEventInfo, "isEditing" & "className">;
        const newEvent: NewEvent = event;

        // needed for a more accurate comparison for upcoming events in `eventRouter.getUpcoming`
        // events will stay on upcoming until event ends
        const endHour = getHourNumber(newEvent.endTime);
        const startMins = Number.isInteger(endHour) ? "00" : "30";
        const eventDate = new Date(
          `${newEvent.date?.toISOString().split("T")[0]}T${Math.floor(endHour)
            .toString()
            .padStart(2, "0")}:${startMins}:00`
        );

        return {
          ...newEvent,
          scheduleId: schedule?.id as string,
          date: eventDate,
        };
      });
      const res = await mutateAsync(eventData);

      if (res) {
        router.push(`/schedule/${slug}`);
        setNoticeMessage("Your events have been successfully published!");
      }
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
      startTime: schedule?.startTime as string,
      endTime: schedule?.endTime as string,
      isEditing: true,
      className: saveWarning !== "" ? "border border-red-500" : "",
    };
    setEvents([...events, newEvent]);
  };

  if (status === "loading" || isScheduleLoading) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <section className="px-8">
      <BackArrow href={`/schedule/${slug}`} page="Schedule" />
      <ScheduleHeader
        title="Publish Event(s)"
        scheduleName={schedule?.name ?? ""}
      />
      {schedule && <AvailabilityResponses schedule={schedule} />}
      <h3 className="mt-8 mb-4 font-semibold">
        {`These are the best times based on your preferences (${
          schedule?.numberOfEvents
        } ${schedule?.numberOfEvents === 1 ? "event" : "events"}, ${
          schedule?.lengthOfEvents
        } ${schedule?.numberOfEvents === 1 ? "long" : "each"}):`}
      </h3>
      <div className="flex flex-col items-center gap-4">
        {events.map((event, index) => (
          <div
            key={`${event.date}, ${event.startTime}-${event.endTime}`}
            className="w-full"
          >
            {events[index]?.isEditing ? (
              <EditEventCard
                index={index}
                events={events}
                scheduleStartTime={schedule?.startTime ?? ""}
                scheduleEndTime={schedule?.endTime ?? ""}
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
                attendees={schedule?.attendees as UserAvailability[]}
              />
            )}
          </div>
        ))}
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
        <Button
          onClick={() => handlePublish()}
          isLoading={isCreateEventsLoading}
          fullWidth
        >
          <FontAwesomeIcon icon={faListCheck} />
          <span>Confirm and Publish</span>
        </Button>
      </div>
    </section>
  );
}

export default Publish;
