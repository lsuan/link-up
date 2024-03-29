import { type Schedule } from "@prisma/client";
import { atom } from "jotai";
import { getFormattedHours } from "./formUtils";

export type AvailabilityProps = {
  schedule: Schedule;
  slug?: string;
  mode?: "read" | "write";
};

export type UserAvailability = {
  user: string;
  name: string;
  availability: object;
};

export type TimeBlock = {
  date: string;
  startTime: string;
  endTime: string;
};

export const disabled = atom<boolean>(true);
export const selected = atom<string[]>([]);
export const updated = atom<boolean>(false);

/** Takes a time in the format tt:X0 XM and returns its numerical value */
export const getHourNumber = (time: string) => {
  const [timeValue, meridiem] = time.split(" ") as [string, string];
  const [hour, half] = timeValue.split(":");
  let hourNumber = Number(hour || "");

  if (hour === "11:59") {
    return 24;
  }

  if (meridiem === "PM" && hourNumber !== 12) {
    hourNumber += 12;
  } else if (meridiem === "AM" && hourNumber === 12) {
    return 0;
  } else if (meridiem === "PM" && hourNumber === 12) {
    return 12;
  }

  if (half === "30") {
    hourNumber += 0.5;
  }
  return hourNumber;
};

/** Gets which users are available per time cell.
 *
 * Ex. { date: [user, ...]}
 */
export const categorizeUsers = (attendees: UserAvailability[]) => {
  if (!attendees) {
    return;
  }
  const categorizedUsers = new Map<string, string[]>();
  attendees.forEach((attendee) => {
    const { name } = attendee;

    Object.entries(attendee.availability).forEach(([date, times]) => {
      times.forEach((time: string) => {
        const timeKey = `${date}:${time}`;
        const users = categorizedUsers.get(timeKey);
        if (users) {
          categorizedUsers.set(timeKey, [...users, name]);
        } else {
          categorizedUsers.set(timeKey, [name]);
        }
      });
    });
  });

  return categorizedUsers;
};

/** Returns the highest number of available users, different from the number of all users. */
export const getMostUsers = (
  categorizedUsers: Map<string, string[]> | undefined
) => {
  let max = 0;
  categorizedUsers?.forEach((users) => {
    if (users.length > max) {
      max = users.length;
    }
  });
  return max;
};

/** Returns the lowest number of available users. */
export const getLeastUsers = (
  categorizedUsers: Map<string, string[]> | undefined,
  totalUsers: number
) => {
  let min = totalUsers;
  categorizedUsers?.forEach((users) => {
    if (users.length < min) {
      min = users.length;
    }
  });
  return min;
};

// TODO: revisit when implementing dark / light mode
/** Sets up the specific colors to be used for cell backgrounds. */
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

/** Get the specific cell background color by its ratio. */
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
  }
  if (ratio > 0.75 && ratio < 1) {
    return colors[3];
  }
  if (ratio > 0.5 && ratio <= 0.75) {
    return colors[2];
  }
  if (ratio > 0.25 && ratio <= 0.5) {
    return colors[1];
  }
  if (ratio <= 0.25) {
    return colors[0];
  }
};

/** Returns numbered bounds [lower, upper] from a time string. */
export const parseRange = (range: string) => {
  const [lower, upper] = range.split(":")[1]?.split("-") as [
    lower: string,
    upper: string
  ];
  return [lower, upper];
};

/** Gets the best possible time blocks per day.
 * Returns a map with each day as a key, and array of mini time block arrays as its value.
 *
 * Ex. { date: [[15-15.5, 15.5-16], [20-20.5, 20.5-21, 21-21.5]], ... }
 */
export const getBestTimesPerDay = (
  categorizedUsers: Map<string, string[]> | undefined,
  mostUsers: number,
  blockLength: number
) => {
  if (!categorizedUsers) {
    return;
  }

  const categorizedEntries = Array.from(categorizedUsers);
  const betterEntries = categorizedEntries.filter(
    (entry) => entry[1].length >= Math.round(mostUsers / 2)
  );
  betterEntries.sort((a, b) => b[1].length - a[1].length);
  const bestTimes = new Map(betterEntries);
  const bestTimesPerDay = new Map<string, string[][]>();

  Array.from(bestTimes.keys()).forEach((time) => {
    const [day, hours] = time.split(":") as [day: string, hours: string];
    const prevHours = bestTimesPerDay.get(day);

    if (prevHours) {
      for (let i = 0; i < prevHours.length; i++) {
        const hourBlock = prevHours[i] as string[];
        if (
          parseRange(`${day}:${hourBlock[hourBlock.length - 1]}`)[1] ===
          parseRange(`${day}:${hours}`)[0]
        ) {
          // needs to continue to the next day if a best time has already been found
          if (hourBlock.length === blockLength) {
            break;
          }
          const current = [...hourBlock, hours];
          const prev = prevHours.slice(0, i);
          const rest = prevHours.slice(i + 1);
          bestTimesPerDay.set(day, [...prev, current, ...rest]);
        } else {
          bestTimesPerDay.set(day, [...prevHours, [hours]]);
        }
      }
    } else {
      bestTimesPerDay.set(day, [[hours]]);
    }
  });
  return bestTimesPerDay;
};

/** Gets the heuristics for all best time options.
 * Returns a map with dates as keys and the heuristic of each block in an array.
 * Each index of the heuristic array represents an individual block.
 *
 * Ex. { date: [3, 4, 5] }
 */
export const getHeuristics = (
  categorizedUsers: Map<string, string[]>,
  bestTimes: Map<string, string[][]>
) => {
  const heuristics = new Map<string, number[]>();
  bestTimes.forEach((blocks, date) => {
    blocks.forEach((times) => {
      const values: number[] = [];
      times.forEach((time) => {
        const heuristic = categorizedUsers.get(`${date}:${time}`)
          ?.length as number;
        values.push(heuristic);
      });
      const prevValues = heuristics.get(date);
      const sum = values.reduce((a, b) => a + b, 0);
      if (prevValues) {
        heuristics.set(date, [...prevValues, sum]);
      } else {
        heuristics.set(date, [sum]);
      }
    });
  });
  return heuristics;
};

const getPrevHour = (upper: string) => Number(upper) - 0.5;

const getNextHour = (lower: string) => Number(lower) + 0.5;

/** Returns the time block that is earliest and closest to the targetValue. */
export const getBestTimeBlock = (
  bestTimes: Map<string, string[][]>,
  heuristics: Map<string, number[]>,
  categorizedUsers: Map<string, string[]>,
  blockLength: number
) => {
  const maxValuesPerDay: number[] = [];
  [...heuristics.values()].forEach((values) => {
    maxValuesPerDay.push(Math.max(...values));
  });

  // key of this map is `${date}:${startTime}-${endTime}`
  // value is the [heuristic, currentBlockLength]
  const chosenBlocks: Map<string, number[]>[] = [];

  let dayIndex = 0;
  bestTimes.forEach((blocks, date) => {
    const blockMap = new Map<string, number[]>();
    const bestValuesPerDay = [...heuristics.values()][dayIndex] as number[];
    const maxValuePerDay = maxValuesPerDay[dayIndex] as number;
    blocks.forEach((block, blockIndex) => {
      if (bestValuesPerDay[blockIndex] === maxValuePerDay) {
        blockMap.set(
          `${date}:${block[0]?.split("-")[0]}-${
            block[block.length - 1]?.split("-")[1]
          }`,
          [maxValuePerDay, block.length]
        );
        chosenBlocks.push(blockMap);
      }
    });
    dayIndex += 1;
  });

  // sort the chosen blocks by heuristic in descending order
  chosenBlocks.sort((firstMap, secondMap) => {
    const values1: number[][] = [...firstMap.values()] as number[][];
    const values2: number[][] = [...secondMap.values()] as number[][];
    const numberOfUsers1 = (values1[0] as number[])[0] ?? 0;
    const numberOfUsers2 = (values2[0] as number[])[0] ?? 0;
    return numberOfUsers2 - numberOfUsers1;
  });

  const chosen = chosenBlocks[0] as Map<string, number[]>;
  let bestBlock = [...chosen.keys()][0] as string;
  const blockData = [...chosen.values()][0] as number[];
  const bestBlockLength = blockData[1] as number;
  const date = bestBlock.split(":")[0] as string;

  // if length of the best block doesn't fulfill the length of the event,
  // then fill it with the best possible continual time
  for (let i = 0; i < blockLength - bestBlockLength; i++) {
    const [lower, upper] = parseRange(bestBlock) as [
      lower: string,
      upper: string
    ];
    const prevHour = `${date}:${getPrevHour(lower)}-${lower}`;
    const nextHour = `${date}:${upper}-${getNextHour(upper)}`;
    const prevBlock = categorizedUsers.get(prevHour) as string[];
    const nextBlock = categorizedUsers.get(nextHour) as string[];
    if (
      (categorizedUsers.has(prevHour) && prevBlock.length) <
      (categorizedUsers.has(nextHour) && nextBlock.length)
    ) {
      const newUpper = nextHour.split(":")[1] as string;
      bestBlock = bestBlock.replace(`-${upper}`, `-${newUpper}:`);
      categorizedUsers.delete(nextHour);
    } else {
      const newLower = prevHour.split(":")[1]?.split("-")[0] as string;
      bestBlock = bestBlock.replace(`${lower}-`, `${newLower}-`);
      categorizedUsers.delete(prevHour);
    }
  }

  const [startTime, endTime] = parseRange(bestBlock) as [string, string];

  // delete the recorded blocks
  for (let start = Number(startTime); start < Number(endTime); start += 0.5) {
    // categorizedUsers.delete(`${date}:${start}-${start + 0.5}`);
    bestTimes.delete(date);
  }

  const formattedRange = getFormattedHours(
    [Number(startTime), Number(endTime)],
    "long"
  );
  return {
    date,
    startTime: formattedRange[0],
    endTime: formattedRange[1],
  } as TimeBlock;
};
