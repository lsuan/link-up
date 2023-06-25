import { router } from "../trpc";
import authRouter from "./auth";
import availabilityRouter from "./availability";
import eventRouter from "./event";
import scheduleRouter from "./schedule";
import userRouter from "./user";

export const appRouter = router({
  auth: authRouter,
  availability: availabilityRouter,
  event: eventRouter,
  schedule: scheduleRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
