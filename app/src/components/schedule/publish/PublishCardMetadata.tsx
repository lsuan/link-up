import Typography from "@ui/Typography";
import { useState } from "react";
import { FiAlertTriangle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  categorizeUsers,
  getHourNumber,
  type UserAvailability,
} from "../../../utils/availabilityUtils";
import { getFormattedHours } from "../../../utils/formUtils";

type Metadata = {
  isEveryoneFree: boolean;
  message: string;
};

/** Grammatically lists users.
 *
 * Ex. ["user1" , "user2", "user3"] returns "user1, user2, and user3"
 */
const listUsers = (users: string[]) => {
  if (users.length === 1) {
    return users[0];
  }
  if (users.length === 2) {
    return `${users[0]} and ${users[1]}`;
  }

  const formatted = users.join(", ");
  const lastCommaIndex = formatted.lastIndexOf(",");
  return `${formatted.slice(0, lastCommaIndex + 1)} and${formatted.slice(
    lastCommaIndex + 1
  )}`;
};

/**
 * Sets the event metadata about any missing users from a given date and time.
 * If everyone is free at a given time, then it doesn't set that information.
 */
const setMetadata = (
  attendees: UserAvailability[],
  date: Date,
  startTime: string,
  endTime: string
) => {
  const metadata: Metadata[] = [];
  const categorizedUsers = categorizeUsers(attendees) as Map<string, string[]>;
  const startHour = getHourNumber(startTime);
  const endHour = getHourNumber(endTime);
  const dateString = date.toISOString().split("T")[0];

  for (let hour = startHour; hour < endHour; hour += 0.5) {
    const endOfBlock = hour + 0.5;
    const timeKey = `${dateString}:${hour}-${endOfBlock}`;
    const [start, end] = getFormattedHours([hour, endOfBlock], "long");
    const currentUsers = categorizedUsers.get(timeKey);

    // gets the names of attendees who are unavailable in the current time block
    const unavailableUsers = attendees
      .filter((attendee) => !currentUsers?.includes(attendee.name))
      .map((user) => user.name);

    if (unavailableUsers.length > 0) {
      metadata.push({
        isEveryoneFree: false,
        message: `${listUsers(
          unavailableUsers
        )} will not be available from ${start} - ${end}`,
      });
    }
  }
  return metadata;
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
  const metadata = setMetadata(attendees, date, startTime, endTime);
  const [isMetadataShown, setIsMetadataShown] = useState<boolean>(false);

  if (metadata.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 py-2 text-brand-500">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>
            <FiAlertTriangle size="1rem" />
          </span>
          <Typography brand>
            NOTE: Some people will be missing during this time.
          </Typography>
        </div>
        <button className="cursor-pointer">
          {isMetadataShown ? (
            <FiChevronUp
              size="1.5rem"
              onClick={() => setIsMetadataShown(false)}
            />
          ) : (
            <FiChevronDown
              size="1.5rem"
              onClick={() => setIsMetadataShown(true)}
            />
          )}
        </button>
      </div>
      {isMetadataShown && (
        <ul className="list-outside list-disc gap-2 whitespace-pre-wrap break-words rounded-lg bg-white py-4 marker:text-brand-500">
          {metadata.map((entry) => (
            <li key={entry.message} className="ml-6 pr-2">
              <Typography brand>{entry.message}</Typography>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PublishCardMetadata;
