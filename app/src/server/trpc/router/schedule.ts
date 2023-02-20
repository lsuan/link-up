import { z } from "zod";
import { type UserAvailability } from "../../../utils/availabilityUtils";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const scheduleRouter = router({
  /** Creates a new schedule with the specified inputs. */
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const newSchedule = await ctx.prisma.schedule.create({
        data: {
          ...input,
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
          {
            attendees: {
              path: "$[*].user",
              array_contains: userId,
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

  /** Sets the availability for the specific user in the following format:
   *
   * JSON DATA STRUCTURE
   * `[ {user: "user", availability: {"date": []}} ]`
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
      const prevData = schedule?.attendees as UserAvailability[];
      let dataToStore;

      if (prevData?.length > 0) {
        const otherData = prevData.filter(
          (entry) => entry.user !== jsonData.user
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

  /**
   * Gets the availability of the current logged in user.
   */
  getUserAvailability: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      try {
        const schedule = await ctx.prisma.schedule.findFirst({
          where: {
            id: input.id,
            attendees: { path: "$[*].user", array_contains: userId },
          },
        });
        const attendees = schedule?.attendees as UserAvailability[];
        const userAvailability = attendees.filter(
          (attendee) => attendee.user === userId
        );
        return userAvailability;
      } catch (e) {
        // if user is not logged in, just an empty array
        return [];
      }
    }),
});

export default scheduleRouter;
