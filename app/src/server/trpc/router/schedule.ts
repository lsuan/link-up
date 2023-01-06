import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
});
