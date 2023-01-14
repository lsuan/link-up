import { faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  getEventTimes,
  getLeastUsers,
  getMostUsers,
  UserAvailability,
} from "../../../utils/availabilityUtils";
import { getFormattedHours } from "../../../utils/formUtils";
import { parseSlug } from "../../../utils/scheduleSlugUtils";
import { trpc } from "../../../utils/trpc";

export type InitialEventInfo = {
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
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
    { enabled: sessionData?.user !== undefined, refetchOnWindowFocus: false }
  );
  const attendees = schedule.data?.attendees as UserAvailability[];
  const [, setNoticeMessage] = useAtom(notice);
  const [isEditing, setIsEditing] = useState<boolean[]>([false]);
  const categorizedUsers = categorizeUsers(attendees);
  const leastUsers = getLeastUsers(categorizedUsers, attendees?.length ?? 0);
  const mostUsers = getMostUsers(categorizedUsers);
  const bestTimes = getBestTimes(categorizedUsers, leastUsers, mostUsers);

  const parseRange = (range: string) => {
    const [lower, upper] = range.split(":")[1]?.split("-") as [
      lower: string,
      upper: string
    ];
    return [lower, upper];
  };

  const initializeEvents = () => {
    if (!schedule.data || !bestTimes) {
      return;
    }

    let events: InitialEventInfo[] = [];
    for (let i = 0; i < schedule.data?.numberOfEvents; i++) {
      const dateTimes = getEventTimes(bestTimes) as string[];
      const dateBlock: string[] = [dateTimes![0] as string];
      // FIXME: revisit this when checking for minute long events
      for (
        let j = 1;
        j < parseInt(schedule.data?.lengthOfEvents.split(" ")[0] ?? "0") * 2 &&
        j < dateTimes.length - 1;
        j++
      ) {
        const currentDateTime = dateTimes[j] as string;
        const [lower, upper] = parseRange(currentDateTime);
        console.log(lower, upper);
        // const prevDate = dateBlock[j - 1] as string;
        if (
          dateBlock.some((current) => {
            return (
              parseRange(current).includes(lower!) ||
              parseRange(current).includes(upper!)
            );
          })
        ) {
          dateBlock.push(currentDateTime);
        }
      }
      dateBlock.forEach((time) => {
        bestTimes.delete(time);
      });

      dateBlock.sort();
      const start = [parseInt(parseRange(dateBlock[0]!)[0] as string)];
      const end = [
        parseInt(parseRange(dateBlock[dateBlock.length - 1]!)[1] as string),
      ];
      const startTime = getFormattedHours(start, "long")[0] as string;
      const endTime = getFormattedHours(end, "long")[0] as string;
      events.push({
        name: `Event ${i + 1}`,
        date: new Date(`${dateBlock[0]?.split(":")[0]!}T00:00:00`),
        startTime,
        endTime,
      });
    }
    return events;
  };

  const events = initializeEvents();

  const handlePublish = () => {
    setNoticeMessage("Your events have been successfully published!");
    router.push(`/schedule/${slug}`);
  };

  // TODO: implement deleting + adding an event
  const deleteEvent = (index: number) => {};

  const addEvent = () => {};

  return (
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
            }
          each):`}
          </h3>
          <div className="my-4 flex flex-col items-center gap-2">
            {events?.map((event, index) => {
              return (
                <div key={index} className="w-full">
                  {isEditing[index] ? (
                    <EditEventCard
                      index={index}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                    />
                  ) : (
                    <PublishEventCard
                      index={index}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      event={event}
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
  );
}

export default Publish;
