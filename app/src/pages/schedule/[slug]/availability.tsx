import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AvailabilityInput from "../../../components/schedule/AvailabilityInput";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import { useSchedule, useUserAvailability } from "../../../hooks/scheduleHooks";

function Availability() {
  const { status } = useSession();
  const router = useRouter();
  const { schedule, isScheduleLoading, slug } = useSchedule(router);
  const { title, isLoading: isUserAvailabilityLoading } = useUserAvailability(
    status,
    schedule
  );

  if (!router.isReady || isScheduleLoading || isUserAvailabilityLoading) {
    return <Loading />;
  }

  return (
    <section className="relative">
      <div className="px-8">
        <BackArrow href={`/schedule/${slug}`} page="Schedule" />
        <ScheduleHeader title={title} scheduleName={schedule?.name ?? ""} />
        {schedule && <AvailabilityInput schedule={schedule} />}
        <h3 className="mt-8 text-xl font-semibold">Responses</h3>
        {schedule && <AvailabilityResponses schedule={schedule} />}
      </div>
    </section>
  );
}

export default Availability;
