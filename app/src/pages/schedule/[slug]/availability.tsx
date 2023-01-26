import { useRouter } from "next/router";
import AvailabilityInput from "../../../components/schedule/AvailabilityInput";
import AvailabilityResponses from "../../../components/schedule/AvailabilityResponses";
import SuccessNotice from "../../../components/schedule/SuccessNotice";
import BackArrow from "../../../components/shared/BackArrow";
import Loading from "../../../components/shared/Loading";
import { parseSlug } from "../../../utils/scheduleSlugUtils";
import { trpc } from "../../../utils/trpc";

function Availability() {
  const router = useRouter();
  const slug = router.asPath.split("/")[2];
  console.log(router.asPath.split("/"));
  const { name, scheduleIdPart } = slug
    ? parseSlug(slug)
    : { name: "", scheduleIdPart: "" };
  const schedule = trpc.schedule.getScheduleFromSlugId.useQuery(
    {
      name: name,
      id: scheduleIdPart,
    },
    { refetchOnWindowFocus: false }
  );

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <section className="relative">
      <SuccessNotice />
      <div className="px-8">
        <BackArrow href={`/schedule/${slug}`} page="Schedule" />

        <h1 className="mb-12 text-3xl font-semibold">Add/Edit Availability</h1>
        {schedule?.data && (
          <AvailabilityInput
            scheduleQuery={schedule}
            schedule={schedule.data}
          />
        )}
        <h2 className="mt-8 text-xl font-semibold">Responses</h2>
        {schedule?.data && <AvailabilityResponses schedule={schedule.data} />}
      </div>
    </section>
  );
}

export default Availability;
