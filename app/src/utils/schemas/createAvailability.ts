import { z } from "zod";

const CREATE_AVAILABILITY_API_SCHEMA = z.object({
  user: z.string(),
  scheduleId: z.string(),
  /** this is the stringified version of the `CalendarDays` object */
  availability: z.string(),
});

export default CREATE_AVAILABILITY_API_SCHEMA;