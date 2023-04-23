import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

const eventRouter = router({
  /** Creates events based on the input. Used in the publish schedule page. */
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

  /** Gets all the upcoming events in which its end time is before now. Used in dashboard. */
  getUpcoming: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const upcoming = await ctx.prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
        schedule: {
          OR: [
            {
              userId,
            },
            // {
            //   attendees: {
            //     path: "$[*].user",
            //     array_contains: userId,
            //   },
            // },
            {
              availabilities: {
                every: {
                  user: userId,
                },
              },
            },
          ],
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        schedule: {
          include: {
            host: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return upcoming;
  }),
});

export default eventRouter;
