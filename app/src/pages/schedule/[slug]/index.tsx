import Button from "@ui/Button";
import Typography from "@ui/Typography";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiEdit, FiExternalLink, FiList } from "react-icons/fi";
import AddToCalendarModal from "../../../components/schedule/AddToCalendarModal";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import ScheduleEventCard from "../../../components/schedule/ScheduleEventCard";
import ShareModal, {
  shareModalShown,
} from "../../../components/schedule/ShareModal";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import ModalBackground from "../../../components/shared/ModalBackground";
import { useSchedule, useUserAvailability } from "../../../hooks/scheduleHooks";
import { type AvailabilityProps } from "../../../utils/availabilityUtils";
import { getHost } from "../../../utils/scheduleUtils";

type SchedulePageAvailabilityProps = AvailabilityProps & {
  buttonTitle: string;
  hasEvents: boolean;
};

/** Renders the availability table on the schedule page. */
function AvailabilitySection({
  schedule,
  slug,
  buttonTitle,
  hasEvents,
}: SchedulePageAvailabilityProps) {
  return (
    <div className="my-8 w-full bg-neutral-300 py-8 px-8">
      <Typography intent="h2" className="mb-8">
        Availability
      </Typography>
      <AvailabilityResponses schedule={schedule} />
      {!hasEvents && (
        <Button href={`/schedule/${slug}/availability`}>
          <FiEdit />
          {buttonTitle}
        </Button>
      )}
    </div>
  );
}

/** Renders the publish button on the schedule page. */
function PublishSection({ slug }: { slug: string }) {
  return (
    <div className="my-8 w-full rounded-lg bg-neutral-300 p-4 text-center">
      <h3 className="mb-4 text-xl font-semibold">
        You&apos;ve received responses!
      </h3>
      <h4 className="mb-2">Ready to finalize dates and times?</h4>
      <Button href={`/schedule/${slug}/publish`}>
        <FiList />
        Publish Event(s)
      </Button>
    </div>
  );
}

/** The individual schedule page. */
function SchedulePage() {
  const router = useRouter();
  const { status, data: sessionData } = useSession();
  // this is needed since the host is different from the actual user
  // and users can still browse this page even if they are not logged in
  const { schedule, isScheduleLoading, slug } = useSchedule(router);
  const [isShareModalShown, setIsShareModalShown] = useAtom(shareModalShown);
  const [isAddToCalendarModalShown, setIsAddToCalendarModalShown] = useState<
    boolean[]
  >([]);
  const {
    title: availabilityButtonTitle,
    isLoading: isUserAvailabilityLoading,
  } = useUserAvailability(status, schedule);

  const host = schedule?.host;
  const isHost = host ? host.id === sessionData?.user?.id : false;
  const events = schedule?.events;
  const hasEvents = events?.length ? events.length > 0 : false;
  const numberOfAttendees = 0;
  useEffect(() => {
    const modalsShown: boolean[] = [];
    events?.forEach(() => modalsShown.push(false));
    setIsAddToCalendarModalShown([...modalsShown]);
  }, [events]);

  if (status === "loading" || isScheduleLoading || isUserAvailabilityLoading) {
    return <Loading />;
  }

  return (
    <>
      <ModalBackground
        isModalOpen={isShareModalShown}
        setIsModalOpen={setIsShareModalShown}
      />
      {isAddToCalendarModalShown.some((isShown) => isShown) && (
        <ModalBackground isModalOpen />
      )}
      <section>
        <div className="px-8">
          {sessionData?.user && (
            <BackArrow href="/dashboard" page="Dashboard" />
          )}
          <header className="relative mb-8 mt-4 flex w-full items-start justify-between gap-2">
            <Typography intent="h1">{schedule?.name}</Typography>
            {isShareModalShown && <ShareModal />}
            <Button onClick={() => setIsShareModalShown(!isShareModalShown)}>
              <FiExternalLink />
              Share
            </Button>
          </header>

          {schedule?.deadline && (
            <Typography>
              <span className="underline">Deadline to Fill By</span>
              <span>{`: ${schedule?.deadline.toLocaleDateString()}`}</span>
            </Typography>
          )}
          <Typography>{schedule?.description}</Typography>
          <Typography>
            {schedule && getHost(sessionData?.user?.id ?? "", schedule)}
          </Typography>

          {events && hasEvents && (
            <div className="relative">
              <div className="horizontal-scrollbar overflow-x-scroll pb-4">
                <div className="flex w-max justify-between gap-4">
                  {events.map((event, index) => (
                    <div key={event.id} className="flex justify-start">
                      {isAddToCalendarModalShown[index] && (
                        <AddToCalendarModal
                          {...event}
                          index={index}
                          isAddToCalendarModalShown={isAddToCalendarModalShown}
                          setIsAddToCalendarModalShown={
                            setIsAddToCalendarModalShown
                          }
                          slug={slug}
                        />
                      )}
                      <ScheduleEventCard
                        {...event}
                        index={index}
                        isAddToCalendarModalShown={isAddToCalendarModalShown}
                        setIsAddToCalendarModalShown={
                          setIsAddToCalendarModalShown
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {isHost && numberOfAttendees === 0 && (
            <div className="my-8 rounded-lg bg-neutral-300 p-4 text-center">
              <Typography intent="h4">Waiting for Responses...</Typography>
              <Typography>
                Click the Share button at the top to share this event to others!
              </Typography>
            </div>
          )}
          {isHost && !hasEvents && numberOfAttendees > 0 && (
            <PublishSection slug={slug} />
          )}
        </div>

        {schedule && (
          <AvailabilitySection
            schedule={schedule}
            slug={slug}
            buttonTitle={availabilityButtonTitle}
            hasEvents={hasEvents}
          />
        )}
      </section>
    </>
  );
}

export default SchedulePage;
