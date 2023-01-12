import { useEffect, useState } from "react";
import {
  setColors,
  UserAvailability,
} from "../../utils/availabilityTableUtils";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityKey({ schedule }: AvailabilityProps) {
  const allAvailability = schedule.attendees as UserAvailability[];
  const total = allAvailability.length;
  const [cellColors, setCellColors] = useState<string[]>([]);

  useEffect(() => {
    const colors = setColors(total);
    setCellColors(colors);
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
              : index === total - 1
              ? `${total}/${total}`
              : ""}
          </div>
        );
      })}
    </div>
  );
}

export default AvailabilityKey;
