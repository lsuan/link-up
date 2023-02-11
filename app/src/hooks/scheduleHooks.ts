import { Schedule } from "@prisma/client";
import { type SessionContextValue } from "next-auth/react";
import { useState } from "react";
import { UserAvailability } from "../utils/availabilityUtils";
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
  const [title, setPageTitle] = useState<string>("");
  const { isLoading } = trpc.schedule.getUserAvailability.useQuery(
    {
      id: schedule?.id!,
    },
    {
      enabled: schedule !== undefined && schedule !== null,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const title = getPageTitle(status, data);
        setPageTitle(title);
      },
    }
  );
  return { title, isLoading };
};
