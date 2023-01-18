import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventRouter } from "./event";
import { exampleRouter } from "./example";
import { scheduleRouter } from "./schedule";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  event: eventRouter,
  schedule: scheduleRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
