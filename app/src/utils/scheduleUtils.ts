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
