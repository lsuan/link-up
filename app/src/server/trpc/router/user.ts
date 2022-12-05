import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  createUser: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newUser = await ctx.prisma.user.create({
        data: input,
      });
      return newUser;
    }),
});
