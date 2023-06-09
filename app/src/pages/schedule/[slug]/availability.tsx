import Typography from "@ui/Typography";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import AvailabilityInput from "../../../components/schedule/AvailabilityInput";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import PublishedEventsNote from "../../../components/schedule/PublishedEventsNote";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import { useSchedule, useUserAvailability } from "../../../hooks/scheduleHooks";
import { updateTitle } from "../../../layouts/Layout";

function Availability() {
  const { status } = useSession();
  const router = useRouter();
  const { schedule, isScheduleLoading, slug } = useSchedule(router);
  const { title, isLoading: isUserAvailabilityLoading } = useUserAvailability(
    status,
    schedule
  );
  const [, setTitle] = useAtom(updateTitle);
  setTitle("Availability | LinkUp");

  if (!router.isReady || isScheduleLoading || isUserAvailabilityLoading) {
    return <Loading />;
  }

  // show a message if events have already been made for this schedule
  if (schedule && schedule.events.length > 0) {
    return <PublishedEventsNote slug={slug} />;
  }

  return (
    <section className="relative">
      <div className="px-8">
        <BackArrow href={`/schedule/${slug}`} page="Schedule" />
        <ScheduleHeader title={title} scheduleName={schedule?.name ?? ""} />
        {schedule && <AvailabilityInput schedule={schedule} />}
        <Typography intent="h2">Responses</Typography>
        {schedule && <AvailabilityResponses schedule={schedule} />}
      </div>
    </section>
  );
}

export default Availability;
