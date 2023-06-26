import { type Availability, type Schedule } from "@prisma/client";
import { type SessionContextValue } from "next-auth/react";
import { type NextRouter } from "next/router";
import { useState } from "react";
import { parseSlug } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

function getPageTitle(
  status: Pick<SessionContextValue, "status">["status"],
  availability: Availability["availability"] | undefined
): string {
  if (status === "unauthenticated") {
    return "Add/Edit Availability";
  }
  return availability ? "Edit Availability" : "Add Availability";
}

/** Sets the title for the availability button at the bottom of the schedule page. */
export function useUserAvailability(
  session: SessionContextValue,
  scheduleId: Schedule["id"] | undefined
): { title: string; isLoading: boolean } {
  const [title, setTitle] = useState<string>("");

  const { isLoading } = trpc.availability.getAvailability.useQuery(
    {
      user: session.status === "authenticated" ? session.data.user?.id : null,
      scheduleId: scheduleId!,
    },
    {
      enabled: scheduleId !== undefined && session.status !== "loading",
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const currentTitle = getPageTitle(
          session.status,
          data.availability?.availability
        );
        setTitle(currentTitle);
      },
    }
  );
  return { title, isLoading: isLoading ?? true };
}

/** Retrieves the `Schedule` record. */
export function useSchedule(
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
