import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  createUser: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const newUser = await ctx.prisma.user.create({
          data: input,
        });
        return { user: newUser };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const trpcError: TRPCError = {
            name: "User Registration Error",
            code: "CONFLICT",
            message: "User already exists with this email.",
          };
          return { trpcError: trpcError };
        }
      }
    }),
});
