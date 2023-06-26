import { z } from "zod";
import { type UserAvailability } from "../../../utils/availabilityUtils";
import CREATE_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/createAvailability";
import { CREATE_SCHEDULE_API_SCHEMA } from "../../../utils/schemas/createSchedule";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const scheduleRouter = router({
  /** Creates a new schedule with the specified inputs. */
  createSchedule: protectedProcedure
    .input(CREATE_SCHEDULE_API_SCHEMA)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { scheduleName: name, ...rest } = input;
      const newSchedule = await ctx.prisma.schedule.create({
        data: {
          name,
          ...rest,
          userId,
        },
      });
      return { schedule: newSchedule };
    }),

  /** Gets the schedule by its id. */
  getScheduleNameById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const scheduleName = await ctx.prisma.schedule.findFirst({
        where: { id: input },
        select: { name: true },
      });

      return scheduleName;
    }),

  /** Gets the schedule by its name and last 8 digits of its id. */
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
          name,
        },
        include: {
          host: true,
          events: true,
        },
      });

      return schedule;
    }),

  /**
   * Finds all unpublished schedules that the user is hosting
   * and ones in which the user has submitted availability.
   */
  getUnstartedSchedules: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const unstarted = await ctx.prisma.schedule.findMany({
      where: {
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
        events: {
          none: {},
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        host: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return unstarted;
  }),

  /** Given the `scheduleId`, gets all availability records for the schedule. */
  getAllAvailability: publicProcedure.input(z.string()).query(async (input) => {
    const availabilities = await input.ctx.prisma.availability.findMany({
      where: {
        scheduleId: input.input,
      },
    });

    return availabilities;
  }),
});

export default scheduleRouter;
