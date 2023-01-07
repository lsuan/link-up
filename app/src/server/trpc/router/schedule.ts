import { z } from "zod";
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
});
