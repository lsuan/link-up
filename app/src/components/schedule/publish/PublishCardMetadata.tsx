import {
  categorizeUsers,
  getHourNumber,
  UserAvailability,
} from "../../../utils/availabilityUtils";
import { getFormattedHours } from "../../../utils/formUtils";

/** Grammatically lists users.
 *
 * Ex. ["user1" , "user2", "user3"] returns "user1, user2, and user3"
 */
const listUsers = (users: string[]) => {
  if (users.length === 2) {
    return `${users[0]} and ${users[1]}`;
  }

  const formatted = users.join(", ");
  const lastCommaIndex = formatted.lastIndexOf(",");
  return (
    formatted.slice(0, lastCommaIndex + 1) +
    " and" +
    formatted.slice(lastCommaIndex + 1)
  );
};

type Metadata = {
  isEveryoneFree: boolean;
  message: string;
  className?: string;
};

function PublishCardMetadata({
  attendees,
  date,
  startTime,
  endTime,
}: {
  attendees: UserAvailability[];
  date: Date;
  startTime: string;
  endTime: string;
}) {
  const dateString = date.toISOString().split("T")[0];
  const categorizedUsers = categorizeUsers(attendees) as Map<string, string[]>;
  const allUsers = attendees.length;
  console.log(attendees);

  // FIXME: Right now metadata shows old user name.
  // Should fix the mutation in settings to change the user name in every availability entry.
  const setMetadata = () => {
    let metadata: Metadata[] = [];
    const startHour = getHourNumber(startTime);
    const endHour = getHourNumber(endTime);
    for (let hour = startHour; hour < endHour; hour += 0.5) {
      const endOfBlock = hour + 0.5;
      const timeKey = `${dateString}:${hour}-${endOfBlock}`;
      const [start, end] = getFormattedHours([hour, endOfBlock], "long");
      const currentUsers = categorizedUsers.get(timeKey);
      if (currentUsers?.length === allUsers) {
        metadata.push({
          isEveryoneFree: true,
          message: `Everyone will be free from ${`${start} - ${end}`}.`,
        });
      } else {
        const unavailableUsers: string[] = [];

        attendees.forEach((attendee) => {
          const attendeeName =
            typeof attendee.name === "string"
              ? attendee.name
              : `${attendee.name.firstName}${
                  attendee.name.lastName ? ` ${attendee.name.lastName}` : ""
                }`;
          if (!currentUsers?.includes(attendeeName)) {
            unavailableUsers.push(attendeeName);
          }
        });

        metadata.push({
          isEveryoneFree: false,
          message: `NOTE***: ${listUsers(
            unavailableUsers
          )} will not be available from ${start} - ${end}`,
          className: "text-indigo-300",
        });
      }
    }

    if (metadata.every((entry) => entry.isEveryoneFree)) {
      metadata = [
        {
          isEveryoneFree: true,
          message: "Everyone is free for the entire event!",
        },
      ];
    }
    return metadata;
  };

  const metadata = setMetadata();

  return (
    <ul className="list-inside list-disc py-4">
      {metadata.map((entry, index) => {
        return (
          <li key={index} className={entry.className}>
            {entry.message}
          </li>
        );
      })}
    </ul>
  );
}

export default PublishCardMetadata;
