import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const eventRouter = router({
  createEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        startTime: z.string(),
        endTime: z.string(),
        location: z.string().nullish().optional(),
        description: z.string().nullish().optional(),
        scheduleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.create({
        data: {
          ...input,
        },
      });

      return { event };
    }),

  getEventsByScheduleId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const events = await ctx.prisma.event.findMany({
        where: {
          scheduleId: input,
        },
      });

      return { events };
    }),
});
