import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import EventCard, {
  addToCalendarModal,
} from "../../../components/dashboard/EventCard";
import AddToCalendarModal from "../../../components/schedule/AddToCalendarModal";
import AvailabilitySection from "../../../components/schedule/AvailabilitySection";
import PublishSection from "../../../components/schedule/PublishSection";
import Share from "../../../components/schedule/ShareModal";
import SuccessNotice from "../../../components/schedule/SuccessNotice";
import BackArrow from "../../../components/shared/BackArrow";
import ModalBackground from "../../../components/shared/ModalBackground";
import { parseSlug } from "../../../utils/scheduleSlugUtils";
import { trpc } from "../../../utils/trpc";

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
  {
    id: "2",
    name: "User Testing Responses!",
    date: new Date("1/4/2022"),
    start: 1673128800,
    end: 1673139600,
    location: "Zoom Link",
    description:
      "Be ready with User Testing responses. We will discuss test outcomes and iterate over design",
  },
  {
    id: "3",
    name: "General",
    date: new Date("1/11/2022"),
    start: 1673736000,
    end: 1673744400,
    location: "Zoom Link",
    description: "Have revisions to design done.",
  },
];

export const notice = atom("");
export const shareModalShown = atom(false);

function Schedule() {
  const router = useRouter();
  // this is needed since it is different from the actual user
  // users can still browse this page even if they are not logged in
  const { data: sessionData } = useSession();
  const { slug } = router.query as { slug: string };
  const { name, scheduleIdPart } = parseSlug(slug);
  const schedule = trpc.schedule.getScheduleFromSlugId.useQuery(
    {
      name: name,
      id: scheduleIdPart,
    },
    { enabled: router.isReady, refetchOnWindowFocus: false }
  );
  const host = schedule.data?.host ?? null;
  const isHost = host ? host.id === sessionData?.user?.id : false;
  const eventSectionWidth = events.length * 256 + 16 * events.length;
  const eventSectionWidthClass = `w-[${eventSectionWidth}px]`;
  const [isShareModalShown, setIsShareModalShown] = useAtom(shareModalShown);
  const [isAddToCalendarModalShown, setIsAddToCalendarModalShown] =
    useAtom(addToCalendarModal);

  return (
    <>
      <ModalBackground
        isModalOpen={isShareModalShown}
        setIsModalOpen={setIsShareModalShown}
      />
      <ModalBackground
        isModalOpen={isAddToCalendarModalShown}
        setIsModalOpen={setIsAddToCalendarModalShown}
      />
      <section>
        <SuccessNotice />
        <div className="px-8">
          <BackArrow href="/dashboard" page="Dashboard" />
          <header className="relative mb-8 mt-4 flex w-full items-start justify-between gap-2">
            <h1 className="text-3xl font-semibold">{schedule?.data?.name}</h1>
            {isShareModalShown && <Share />}
            <button
              className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
              onClick={() => setIsShareModalShown(!isShareModalShown)}
            >
              <FontAwesomeIcon icon={faShareFromSquare} />
              Share
            </button>
          </header>

          {schedule?.data?.deadline && (
            <p>
              <span className="underline">Deadline to Fill By</span>
              <span>{`: ${schedule?.data?.deadline.toLocaleDateString()}`}</span>
            </p>
          )}
          <div className="my-4">{schedule?.data?.description}</div>
          <div className="z-10 mb-4 font-semibold">{`Hosted by: ${
            host?.firstName
          } ${host?.lastName || ""}`}</div>

          {events.length > 0 ? (
            <div className="relative">
              {isAddToCalendarModalShown && <AddToCalendarModal />}
              <div className="horizontal-scrollbar overflow-x-scroll pb-4">
                <div
                  className={`flex w-fit justify-between gap-4 ${eventSectionWidthClass}`}
                >
                  {events.map((event) => {
                    return (
                      <EventCard key={event.id} {...event} className="w-64" />
                    );
                  })}
                </div>
              </div>
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

        {schedule.data && (
          <>
            <AvailabilitySection schedule={schedule.data} slug={slug} />
            <PublishSection />
          </>
        )}
      </section>
    </>
  );
}

export default Schedule;
