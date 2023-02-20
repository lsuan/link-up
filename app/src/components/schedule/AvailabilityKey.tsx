import {
  categorizeUsers,
  getLeastUsers,
  getMostUsers,
  setColors,
  type UserAvailability,
} from "../../utils/availabilityUtils";
import { type AvailabilityProps } from "./AvailabilitySection";

function AvailabilityKey({ schedule }: AvailabilityProps) {
  const allAvailability = schedule?.attendees as UserAvailability[];
  const total = allAvailability?.length;
  const categorizedUsers = categorizeUsers(allAvailability);
  const mostUsers = getMostUsers(categorizedUsers);
  const leastUsers = getLeastUsers(categorizedUsers, total);
  const cellColors = setColors(mostUsers);
  const hasAvailability = allAvailability?.every(
    (attendee) => Object.values(attendee.availability).length > 0
  );

  if (!hasAvailability) {
    return null;
  }

  return (
    <div className="my-4 mx-auto flex w-full max-w-xs overflow-hidden rounded-full border border-indigo-500 text-center text-xs font-semibold">
      {cellColors.map((color, index) => (
        <div
          key={`index-${color}`}
          className={`w-full ${color} py-1${
            index === cellColors.length - 1 ? " text-black" : ""
          }`}
        >
          {index === 0
            ? `${leastUsers !== 0 ? 0 : leastUsers}/${total}`
            : index === cellColors.length - 1 && `${mostUsers}/${total}`}
        </div>
      ))}
    </div>
  );
}

export default AvailabilityKey;
