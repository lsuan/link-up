import { getFormattedHours } from "./formUtils";

export type UserAvailability = {
  user: string;
  name:
    | {
        firstName: string;
        lastName: string | null;
      }
    | string;
  availability: object;
};

export const getHourNumber = (time: string) => {
  const [hour, meridiem] = time.split(" ");
  const hourNumber = parseInt(hour?.split(":")[0] || "");

  if (meridiem === "AM" && hourNumber !== 12) {
    return hourNumber;
  } else if (meridiem === "PM" && hourNumber !== 12) {
    return hourNumber + 12;
  } else if (meridiem === "AM" && hourNumber === 12) {
    return 24;
  } else {
    return 0;
  }
};

export const categorizeUsers = (attendees: UserAvailability[]) => {
  if (!attendees) {
    return;
  }
  const categorizedUsers = new Map<string, string[]>();
  attendees.forEach((attendee) => {
    let name: string;
    if (typeof attendee.name === "string") {
      name = attendee.name;
    } else {
      name = attendee.name.firstName;
    }

    for (const [date, times] of Object.entries(attendee.availability)) {
      times.forEach((time: string) => {
        const timeKey = `${date}:${time}`;
        const users = categorizedUsers.get(timeKey);
        if (users) {
          categorizedUsers.set(timeKey, [...users, name]);
        } else {
          categorizedUsers.set(timeKey, [name]);
        }
      });
    }
  });

  return categorizedUsers;
};

export const getMostUsers = (
  categorizedUsers: Map<string, string[]> | undefined
) => {
  let max = 0;
  categorizedUsers?.forEach((users, _timeKey) => {
    if (users.length > max) {
      max = users.length;
    }
  });
  return max;
};

export const getLeastUsers = (
  categorizedUsers: Map<string, string[]> | undefined,
  totalUsers: number
) => {
  let min = totalUsers;
  categorizedUsers?.forEach((users, _timeKey) => {
    if (users.length < min) {
      min = users.length;
    }
  });
  return min;
};

// TODO: revisit when implementing dark / light mode
// FIXME: incorrect when most users is 1
export const setColors = (mostUsers: number) => {
  const cellColors: string[] = [];

  if (mostUsers === 1) {
    cellColors.push("bg-neutral-900", "bg-neutral-300");
  } else if (mostUsers === 2) {
    cellColors.push("bg-neutral-900", "bg-indigo-500", "bg-neutral-300");
  } else if (mostUsers === 3) {
    cellColors.push(
      "bg-neutral-900",
      "bg-indigo-700",
      "bg-indigo-300",
      "bg-neutral-300"
    );
  } else {
    cellColors.push(
      "bg-neutral-900",
      "bg-indigo-700",
      "bg-indigo-500",
      "bg-indigo-300",
      "bg-neutral-300"
    );
  }

  return cellColors;
};

export const getCellColor = (
  numberOfUsers: number,
  mostUsers: number,
  colors: string[] // max length is 5, but if less than 5 then length is totalUsers
) => {
  const ratio = numberOfUsers / mostUsers;

  if (mostUsers < 5) {
    return colors[numberOfUsers];
  }

  // need to check if ratio is in the range for the appropriate color
  // ranges go up by 20% since 1/5 === 20%
  if (ratio === 1) {
    return colors[4];
  } else if (ratio > 0.75 && ratio < 1) {
    return colors[3];
  } else if (ratio > 0.5 && ratio <= 0.75) {
    return colors[2];
  } else if (ratio > 0.25 && ratio <= 0.5) {
    return colors[1];
  } else if (ratio <= 0.25) {
    return colors[0];
  }
};

/** Returns a sorted map of the availability */
export const getBestTimes = (
  categorizedUsers: Map<string, string[]> | undefined,
  leastUsers: number,
  mostUsers: number
) => {
  if (!categorizedUsers) {
    return;
  }

  let categorizedEntries = Array.from(categorizedUsers);
  // filtering out the entries with least users to save memory usage
  if (leastUsers !== mostUsers) {
    categorizedEntries = categorizedEntries.filter(
      (entry) => entry[1].length > leastUsers
    );
  } else {
    categorizedEntries = categorizedEntries.filter(
      (entry) => entry[1].length > 0
    );
  }
  categorizedEntries.sort((a, b) => {
    return b[1].length - a[1].length;
  });
  const bestTimes = new Map(categorizedEntries);
  return bestTimes;
};

/** Returns an array with a collection of all times from the best day*/
export const getEventTimes = (bestTimes: Map<string, string[]>) => {
  if (!bestTimes) {
    return;
  }

  const times = [...bestTimes.keys()];
  if (!times) {
    return;
  }
  const sameDate = times.filter((time) => time.split(":")[0]);
  return sameDate;
};

/** Gets the timeblock for the current best day */
export const getTimeBlock = (
  bestTimes: Map<string, string[]>,
  lengthOfEvents: number,
  parseRange: (range: string) => string[]
) => {
  const dateTimes = getEventTimes(bestTimes) as string[];
  const dateBlock: string[] = [dateTimes[0] as string];

  // in the case where the event is 30 mins long
  if (lengthOfEvents === 30) {
    lengthOfEvents = 0.5;
  }
  for (let j = 1; j < lengthOfEvents * 2 && j < dateTimes.length - 1; j++) {
    const currentDateTime = dateTimes[j] as string;
    const [lower, upper] = parseRange(currentDateTime) as [
      lower: string,
      upper: string
    ];
    if (
      dateBlock.some((current) => {
        return (
          parseRange(current).includes(lower) ||
          parseRange(current).includes(upper)
        );
      })
    ) {
      dateBlock.push(currentDateTime);
    }
  }
  dateBlock.forEach((time) => {
    bestTimes.delete(time);
  });

  if (!dateBlock[0]) {
    return ["", "", ""];
  }

  dateBlock.sort();
  const start = [parseInt(parseRange(dateBlock[0])[0] as string)];
  const end = [
    parseInt(parseRange(dateBlock[dateBlock.length - 1]!)[1] as string),
  ];
  const date = dateBlock[0].split(":")[0];
  const startTime = getFormattedHours(start, "long")[0] as string;
  const endTime = getFormattedHours(end, "long")[0] as string;
  return [date, startTime, endTime];
};
