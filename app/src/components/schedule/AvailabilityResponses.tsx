import { memo } from "react";
import { type AvailabilityProps } from "../../utils/availabilityUtils";
import AvailabilityGrid from "./AvailabilityGrid";
import AvailabilityKey from "./AvailabilityKey";

const AvailabilityResponses = memo(({ schedule }: AvailabilityProps) => (
  <section>
    <AvailabilityKey schedule={schedule} />
    <AvailabilityGrid schedule={schedule} mode="read" />
  </section>
));
export default AvailabilityResponses;
