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
