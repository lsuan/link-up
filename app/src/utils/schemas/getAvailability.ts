import { z } from "zod";

const GET_AVAILABILITY_API_SCHEMA = z.object({
  /** if the user is null or undefined, then the user is not logged in */
  user: z.string().nullish(),
  scheduleId: z.string(),
});

export default GET_AVAILABILITY_API_SCHEMA;
