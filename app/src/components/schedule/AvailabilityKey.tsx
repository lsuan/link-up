import { useEffect, useState } from "react";
import {
  categorizeUsers,
  getMostUsers,
  setColors,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityKey({ schedule }: AvailabilityProps) {
  const allAvailability = schedule?.attendees as UserAvailability[];
  const total = allAvailability?.length;
  const [cellColors, setCellColors] = useState<string[]>([]);
  const categorizedUsers = categorizeUsers(allAvailability);
  const mostUsers = getMostUsers(categorizedUsers) ?? 0;

  useEffect(() => {
    if (allAvailability && allAvailability.length > 0) {
      const colors = setColors(mostUsers);
      setCellColors(colors);
    }
  }, [allAvailability]);

  return (
    <div className="my-4 mx-auto flex w-full max-w-xs overflow-hidden rounded-full border border-indigo-500 text-center text-xs font-semibold">
      {cellColors.map((color, index) => {
        return (
          <div
            key={index}
            className={`w-full ${color} py-1${
              index === total - 1 ? " text-black" : ""
            }`}
          >
            {index === 0
              ? `1/${total}`
              : index === mostUsers - 1
              ? `${mostUsers}/${total}`
              : ""}
          </div>
        );
      })}
    </div>
  );
}

export default AvailabilityKey;
