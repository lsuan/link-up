import { protectedProcedure, publicProcedure, router } from "../trpc";

const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
  getSecretMessage: protectedProcedure.query(
    () => "you can now see this secret message!"
  ),
});

export default authRouter;
