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

// TODO: revisit when implementing dark / light mode
export const setColors = (mostUsers: number) => {
  const cellColors: string[] = [];

  if (mostUsers === 1) {
    cellColors.push("bg-neutral-900");
  } else if (mostUsers === 2) {
    cellColors.push("bg-neutral-900", "bg-neutral-300");
  } else if (mostUsers === 3) {
    cellColors.push("bg-neutral-900", "bg-indigo-700", "bg-indigo-500");
  } else if (mostUsers === 4) {
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
  if (ratio <= 1) {
    return colors[4];
  } else if (ratio <= 0.8) {
    return colors[3];
  } else if (ratio <= 0.6) {
    return colors[2];
  } else if (ratio <= 0.4) {
    return colors[1];
  } else if (ratio <= 0.2) {
    return colors[0];
  }
};
