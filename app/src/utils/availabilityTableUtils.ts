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

// TODO: revisit when implementing dark / light mode
export const setColors = (total: number) => {
  const cellColors: string[] = [];

  // want to go from 900 -> 700 -> 500 -> 300 -> 100
  if (total === 1) {
    cellColors.push("bg-indigo-900");
  } else if (total === 2) {
    cellColors.push("bg-indigo-900", "bg-indigo-100");
  } else if (total === 3) {
    cellColors.push("bg-indigo-900", "bg-indigo-700", "bg-indigo-500");
  } else if (total === 4) {
    cellColors.push(
      "bg-indigo-900",
      "bg-indigo-700",
      "bg-indigo-300",
      "bg-indigo-100"
    );
  } else {
    cellColors.push(
      "bg-indigo-900",
      "bg-indigo-700",
      "bg-indigo-500",
      "bg-indigo-300",
      "bg-indigo-100"
    );
  }

  return cellColors;
};
