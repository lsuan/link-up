import { z } from "zod";
import { UserAvailability } from "../../../utils/availabilityTableUtils";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const scheduleRouter = router({
  createSchedule: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        startTime: z.string(),
        endTime: z.string(),
        deadline: z.date().nullish().optional(),
        numberOfEvents: z.number(),
        lengthOfEvents: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newSchedule = await ctx.prisma.schedule.create({
        data: {
          ...input,
        },
      });
      return { schedule: newSchedule };
    }),

  getScheduleFromSlugId: publicProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { name, id } = input;
      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: {
            endsWith: id,
          },
          name: name,
        },
        include: {
          host: true,
        },
      });

      return schedule;
    }),

  getUnstartedSchedules: protectedProcedure.query(async ({ ctx }) => {
    const unstarted = await ctx.prisma.schedule.findMany({
      where: {
        events: {
          none: {},
        },
      },
    });

    return unstarted;
  }),

  /*
   * JSON DATA STRUCTURE
   * [ {user: "user", availability: {"date": []}} ]
   */
  setAvailability: publicProcedure
    .input(z.object({ id: z.string(), attendee: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const jsonData = JSON.parse(input.attendee);

      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
        },
      });
      let prevData = schedule?.attendees as UserAvailability[];
      let dataToStore;

      if (prevData?.length > 0) {
        const otherData = prevData.filter(
          (entry) => entry["user"] !== jsonData["user"]
        );
        dataToStore = otherData.concat([jsonData]);
      } else {
        dataToStore = [jsonData];
      }
      const newSchedule = await ctx.prisma.schedule.update({
        data: { attendees: dataToStore },
        where: { id: input.id },
      });
      return newSchedule;
    }),

  /*
   * this procedure gets the availability for only user
   * used for filling in the response table if they wish to edit their times
   * */
  getUserAvailability: publicProcedure
    .input(z.object({ id: z.string(), user: z.string() }))
    .query(async ({ input, ctx }) => {
      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          attendees: { path: "$[*].user", array_contains: input.user },
        },
      });

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input.user,
        },
      });
      const userFullName = user
        ? { firstName: user.firstName, lastName: user.lastName }
        : input.user;
      const convertedAvailability =
        (schedule?.attendees as UserAvailability[]) ?? [];
      return convertedAvailability.filter(
        (userAvailability) => userAvailability.user === input.user
      );
    }),
});
