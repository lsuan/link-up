import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { scheduleRouter } from "./schedule";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  schedule: scheduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
