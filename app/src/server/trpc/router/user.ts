import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().nullish(),
        email: z.string(),
        password: z.string(),
      })
    )
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
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      {
        if (input.id.length === 0) {
          return null;
        }

        const user = await ctx.prisma.user.findFirst({
          where: { id: input.id },
        });
        return user;
      }
    }),
});
