import { type Availability } from "@prisma/client";

type ScheduleParam = {
  userId: string;
  host: {
    firstName: string;
    lastName: string | null;
  };
};

export const createSlug = (name: string, id: string) => {
  const joinedName = name.toLowerCase().split(" ").join("-");
  const lastOfId = id.substring(id.length - 8);
  return `${joinedName}-${lastOfId}`;
};

export const parseSlug = (slug: string) => {
  const parsed = slug?.split("-");
  const scheduleIdPart = parsed?.pop() || ("" as string);
  const name = parsed?.join(" ") || "";
  return { name, scheduleIdPart };
};

export const getHost = (userId: string, schedule: ScheduleParam) => {
  if (userId === schedule.userId) {
    return "Hosted by: You";
  }

  return `Hosted by: ${schedule.host.firstName}${
    ` ${schedule.host.lastName}` ?? ""
  }`;
};

/**
 * Gets the availability title based on whether the logged in user
 * has given a previous availabilty.
 * Anonymous users default to add "Add Availability"
 */
export function getAvailabilityButtonTitle(
  user: string | undefined,
  availabilities: Availability[] | undefined
): { title?: string; isLoading: boolean } {
  console.log("user", user);
  console.log("availabilities", availabilities);
  if (user === undefined && availabilities === undefined) {
    return { isLoading: true };
  }
  const foundUser = availabilities?.find(
    (availability) => availability.user === user
  );
  if (foundUser) {
    return { title: "Edit Availability", isLoading: false };
  }
  return { title: "Add Availability", isLoading: false };
}
