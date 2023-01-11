import { useAtom } from "jotai";
import AvailabilityGrid, { hoverInfo } from "./AvailabilityGrid";
import AvailabilityGridWrite from "./AvailabilityGridWrite";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityResponses({ schedule }: AvailabilityProps) {
  const [hoverInfoText] = useAtom(hoverInfo);

  return (
    <section>
      {hoverInfoText.length !== 0 && (
        <div className=" mt-4 rounded-lg bg-neutral-700 p-2 text-xs">
          Available: {hoverInfoText.join(", ")}
        </div>
      )}
      <AvailabilityGrid schedule={schedule} mode="read" />
    </section>
  );
}
export default AvailabilityResponses;
