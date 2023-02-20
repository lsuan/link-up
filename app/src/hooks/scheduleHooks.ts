import { type Schedule } from "@prisma/client";
import { type SessionContextValue } from "next-auth/react";
import { type NextRouter } from "next/router";
import { useState } from "react";
import { type UserAvailability } from "../utils/availabilityUtils";
import { parseSlug } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

type SessionStatus = Pick<SessionContextValue, "status">["status"];

const getPageTitle = (
  status: SessionStatus,
  availability: UserAvailability[]
): string => {
  if (status === "unauthenticated") {
    return "Add/Edit Availability";
  }
  return availability.length > 0 ? "Edit Availability" : "Add Availability";
};

export const useUserAvailability = (
  status: SessionStatus,
  schedule: Schedule | null | undefined
): { title: string; isLoading: boolean } => {
  const [title, setTitle] = useState<string>("");
  const { isLoading } = trpc.schedule.getUserAvailability.useQuery(
    {
      id: schedule?.id ?? "",
    },
    {
      enabled: schedule !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const currentTitle = getPageTitle(status, data);
        setTitle(currentTitle);
      },
    }
  );
  return { title, isLoading };
};

export const useSchedule = (
  router: NextRouter,
  onSuccess?: (data: Schedule | null) => void
) => {
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
};
