import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const eventRouter = router({
  createEvents: protectedProcedure
    .input(
      z.array(
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
    )
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.createMany({
        data: input,
      });

      return { event };
    }),

  getUpcoming: protectedProcedure.query(({ ctx }) => {
    const upcoming = ctx.prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    return upcoming;
  }),
});
