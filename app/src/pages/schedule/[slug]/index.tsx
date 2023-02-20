import {
  faListCheck,
  faPenToSquare,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddToCalendarModal from "../../../components/schedule/AddToCalendarModal";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import ScheduleEventCard from "../../../components/schedule/ScheduleEventCard";
import Share, {
  shareModalShown,
} from "../../../components/schedule/ShareModal";
import SuccessNotice from "../../../components/schedule/SuccessNotice";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import ModalBackground from "../../../components/shared/ModalBackground";
import { useSchedule, useUserAvailability } from "../../../hooks/scheduleHooks";
import { type AvailabilityProps } from "../../../utils/availabilityUtils";
import { getHost } from "../../../utils/scheduleUtils";

type SchedulePageAvailabilityProps = AvailabilityProps & {
  buttonTitle: string;
};

function AvailabilitySection({
  schedule,
  slug,
  buttonTitle,
}: SchedulePageAvailabilityProps) {
  return (
    <div className="my-8 w-full bg-neutral-500 py-8 px-8">
      <h2 className="mb-8 rounded-lg text-3xl font-semibold">Availability</h2>
      <AvailabilityResponses schedule={schedule} />
      <button className="flex w-full rounded-lg border border-white bg-neutral-900 p-2 transition-colors hover:bg-neutral-700">
        <Link href={`/schedule/${slug}/availability`} className="w-full">
          <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
          {buttonTitle}
        </Link>
      </button>
    </div>
  );
}

function PublishSection({ slug }: { slug: string }) {
  return (
    <div className="my-8 w-full text-center">
      <h3 className="mb-4 text-xl font-semibold">
        You&apos;ve received responses!
      </h3>
      <h4 className="mb-2">Ready to finalize dates and times?</h4>
      <button className="flex w-full justify-center rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black">
        <Link className="w-full" href={`/schedule/${slug}/publish`}>
          <FontAwesomeIcon icon={faListCheck} className="mr-2" />
          Publish Event(s)
        </Link>
      </button>
    </div>
  );
}

function SchedulePage() {
  const router = useRouter();
  const { status, data: sessionData } = useSession();
  // this is needed since the host is different from the actual user
  // and users can still browse this page even if they are not logged in
  const { schedule, isScheduleLoading, slug } = useSchedule(router);
  const host = schedule?.host ?? null;
  const isHost = host ? host.id === sessionData?.user?.id : false;
  const events = schedule?.events;
  const hasEvents = events?.length ? events.length > 0 : false;
  const [isShareModalShown, setIsShareModalShown] = useAtom(shareModalShown);
  const [isAddToCalendarModalShown, setIsAddToCalendarModalShown] = useState<
    boolean[]
  >([]);

  const {
    title: availabilityButtonTitle,
    isLoading: isUserAvailabilityLoading,
  } = useUserAvailability(status, schedule);

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
        <SuccessNotice />
        <div className="px-8">
          {sessionData?.user && (
            <BackArrow href="/dashboard" page="Dashboard" />
          )}
          <header className="relative mb-8 mt-4 flex w-full items-start justify-between gap-2">
            <h1 className="text-3xl font-semibold">{schedule?.name}</h1>
            {isShareModalShown && <Share />}
            <button
              className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
              onClick={() => setIsShareModalShown(!isShareModalShown)}
            >
              <FontAwesomeIcon icon={faShareFromSquare} />
              Share
            </button>
          </header>

          {schedule?.deadline && (
            <p>
              <span className="underline">Deadline to Fill By</span>
              <span>{`: ${schedule?.deadline.toLocaleDateString()}`}</span>
            </p>
          )}
          <p className="my-4">{schedule?.description}</p>
          <p className="z-10 mb-4 font-semibold">
            {schedule && getHost(sessionData?.user?.id ?? "", schedule)}
          </p>

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
          {isHost && Object.keys(schedule?.attendees ?? {}).length === 0 ? (
            <div className="my-8 rounded-lg bg-neutral-700 p-4 text-center">
              <h4 className="mb-2 text-xl font-semibold">
                Waiting for Responses...
              </h4>
              <div>
                Click the Share button at the top to share this event to others!
              </div>
            </div>
          ) : (
            isHost && <PublishSection slug={slug} />
          )}
        </div>

        {schedule && (
          <AvailabilitySection
            schedule={schedule}
            slug={slug}
            buttonTitle={availabilityButtonTitle}
          />
        )}
      </section>
    </>
  );
}

export default SchedulePage;
