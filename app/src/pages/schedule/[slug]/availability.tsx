import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import AvailabilityInput from "../../../components/schedule/AvailabilityInput";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import ScheduleHeader from "../../../components/schedule/ScheduleHeader";
import SuccessNotice from "../../../components/schedule/SuccessNotice";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import { useUserAvailability } from "../../../hooks/scheduleHooks";
import { UserAvailability } from "../../../utils/availabilityUtils";
import { parseSlug } from "../../../utils/scheduleUtils";
import { trpc } from "../../../utils/trpc";

function Availability() {
  const { status } = useSession();
  const router = useRouter();
  const slug = router.asPath.split("/")[2];
  const { name, scheduleIdPart } = slug
    ? parseSlug(slug)
    : { name: "", scheduleIdPart: "" };
  const { data: schedule, isLoading: isScheduleLoading } =
    trpc.schedule.getScheduleFromSlugId.useQuery(
      {
        name: name,
        id: scheduleIdPart,
      },
      {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {},
      }
    );

  const { title, isLoading: isUserAvailabilityLoading } = useUserAvailability(
    status,
    schedule
  );

  const getPageTitle = (availability: UserAvailability[]): string => {
    if (status === "unauthenticated") {
      return "Add/Edit Availability";
    }
    return availability.length > 0 ? "Edit Availability" : "Add Availability";
  };

  if (!router.isReady || isScheduleLoading || isUserAvailabilityLoading) {
    return <Loading />;
  }

  return (
    <section className="relative">
      <SuccessNotice />
      <div className="px-8">
        <BackArrow href={`/schedule/${slug}`} page="Schedule" />
        <ScheduleHeader title={title} scheduleName={schedule?.name!} />
        <AvailabilityInput schedule={schedule!} />
        <h3 className="mt-8 text-xl font-semibold">Responses</h3>
        {schedule && <AvailabilityResponses schedule={schedule} />}
      </div>
    </section>
  );
}

export default Availability;
