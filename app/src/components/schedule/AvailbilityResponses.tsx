import { atom, useAtom } from "jotai";
import AvailabilityGrid from "./AvailabilityGrid";
import AvailabilityKey from "./AvailabilityKey";
import { AvailabilityProps } from "./AvailabilitySection";

type AvailabilityStatus =
  | {
      available: string[];
      unavailable: string[];
    }
  | undefined;

export const hoverInfo = atom<AvailabilityStatus>(undefined);

function AvailabilityResponses({ schedule }: AvailabilityProps) {
  const [hoverInfoText] = useAtom(hoverInfo);

  return (
    <section>
      <AvailabilityKey schedule={schedule} />
      {hoverInfoText && hoverInfoText.available.length !== 0 && (
        <div className=" mt-4 rounded-lg bg-neutral-700 p-2 text-xs">
          <p>{`Available: ${hoverInfoText?.available.join(", ")}`}</p>
          <p>{`Unavailable: ${hoverInfoText?.unavailable.join(", ")}`}</p>
        </div>
      )}
      <AvailabilityGrid schedule={schedule} mode="read" />
    </section>
  );
}
export default AvailabilityResponses;
