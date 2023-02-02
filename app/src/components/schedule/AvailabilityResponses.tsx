import { useAtom } from "jotai";
import { memo, useEffect } from "react";
import AvailabilityGrid from "./AvailabilityGrid";
import { updated } from "./AvailabilityInput";
import AvailabilityKey from "./AvailabilityKey";
import { AvailabilityProps } from "./AvailabilitySection";

const AvailabilityResponses = memo(function AvailabilityResponses({
  schedule,
}: AvailabilityProps) {
  return (
    <section>
      <AvailabilityKey schedule={schedule} />

      <AvailabilityGrid schedule={schedule} mode="read" />
    </section>
  );
});
export default AvailabilityResponses;
