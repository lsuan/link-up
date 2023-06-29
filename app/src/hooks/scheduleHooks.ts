import { type Schedule } from "@prisma/client";
import { type NextRouter } from "next/router";
import { parseSlug } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

/** Retrieves the `Schedule` record. */
export default function useSchedule(
  router: NextRouter,
  onSuccess?: (data: Schedule | null) => void
) {
  const { slug } = router.query as { slug: string };
  const { name, scheduleIdPart } = parseSlug(slug);
  const { data: schedule, isLoading: isScheduleLoading } =
    trpc.schedule.getScheduleFromSlugId.useQuery(
      {
        name,
        id: scheduleIdPart,
      },
      {
        enabled: router.isReady,
        refetchOnWindowFocus: false,
        onSuccess: onSuccess ? (data) => onSuccess(data) : undefined,
      }
    );

  return { schedule, isScheduleLoading, slug };
}
