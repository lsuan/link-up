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
          data: { ...input },
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
          include: { accounts: true },
        });
        return user;
      }
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string().nullish(),
        email: z.string().optional(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const otherUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (otherUser?.id !== input.id) {
        const trpcError: TRPCError = {
          name: "User Update Error",
          code: "CONFLICT",
          message: "User already exists with this email.",
        };
        return { user: otherUser, trpcError: trpcError };
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: { ...input },
      });
      return { user, success: { message: "Changes have been saved!" } };
    }),
});
