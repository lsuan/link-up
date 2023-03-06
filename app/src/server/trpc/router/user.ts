import { Prisma, type PrismaClient, type User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { type TRPCError } from "@trpc/server";
import { z } from "zod";
import { type UserAvailability } from "../../../utils/availabilityUtils";
import { hashPassword } from "../../../utils/passwordUtils";
import { protectedProcedure, publicProcedure, router } from "../trpc";

/** Updates all submitted availabilities with the user's updated name */
const updateScheduleAttendees = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  user: User
) => {
  const schedules = await prisma?.schedule.findMany({
    where: {
      attendees: {
        path: "$[*].user",
        array_contains: user.id,
      },
    },
  });

  const updatedAttendeesQueries: Prisma.PrismaPromise<unknown>[] = [];
  schedules.forEach((schedule) => {
    const attendees = schedule.attendees as Prisma.JsonArray;
    attendees.forEach((attendee) => {
      const newAttendee = attendee as UserAvailability;
      if (newAttendee.user === user.id) {
        newAttendee.name = `${user.firstName}${
          user.lastName ? ` ${user.lastName}` : ""
        }`;
      }
    });
    const whereClause = Prisma.validator<Prisma.ScheduleWhereInput>()({
      id: schedule.id,
    });

    const dataClause = Prisma.validator<Prisma.ScheduleUpdateInput>()({
      attendees: attendees as Prisma.JsonValue[],
    });

    updatedAttendeesQueries.push(
      prisma.schedule.update({
        where: whereClause,
        data: dataClause,
      })
    );
  });

  await prisma.$transaction(updatedAttendeesQueries);
};

const userRouter = router({
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
        const hashed = await hashPassword(input.password);
        const newUser = await ctx.prisma.user.create({
          data: { ...input, password: hashed },
        });
        return { user: newUser };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const trpcError: TRPCError = {
            name: "User Registration Error",
            code: "CONFLICT",
            message: "User already exists with this email.",
          };
          return { trpcError };
        }
      }
    }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (input.id.length === 0) {
        return null;
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: input.id },
        include: { accounts: true },
      });
      return user;
    }),

  updateUserEmailCredentials: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string(),
        // password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const otherUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      const { id } = ctx.session.user;

      if (otherUser?.id !== id) {
        const trpcError: TRPCError = {
          name: "User Update Error",
          code: "CONFLICT",
          message: "User already exists with this email.",
        };
        return { user: otherUser, trpcError };
      }

      const user = await ctx.prisma.user.update({
        where: { id },
        data: { ...input },
      });

      updateScheduleAttendees(ctx.prisma, user);

      return { user, success: { message: "Changes have been saved!" } };
    }),

  updateUserWithAccountProvider: protectedProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = ctx.session.user;
      const user = await ctx.prisma.user.update({
        where: { id },
        data: {
          ...input,
        },
      });

      await updateScheduleAttendees(ctx.prisma, user);

      return { user, success: { message: "Changes have been saved!" } };
    }),

  getUserFullName: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!input) {
        return null;
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });

      if (!user) {
        return null;
      }
      return { firstName: user.firstName, lastName: user.lastName };
    }),
});

export default userRouter;
