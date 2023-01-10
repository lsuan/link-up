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

  /** JSON DATA STRUCTURE
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

      if (prevData.length > 0) {
        const found = prevData.filter(
          (entry) => entry["user"] === jsonData["user"]
        );

        if (found) {
          dataToStore = [jsonData];
        } else {
          dataToStore = prevData.concat([jsonData]);
        }
        // const otherData =
        //   prevData.filter((entry) => entry["user"] !== jsonData["user"]) ?? [];
        // const found = prevData.filter(
        //   (entry) => entry["user"] === jsonData["user"]
        // );
        // let newData = [jsonData];
        // if (found) {
        //   console.log("existlksjdf");
        //   const existingData = found[0];
        //   const newObject = jsonData.availability;
        //   const existingAvailability = existingData?.availability ?? {};
        //   for (const [date, hour] of Object.entries(existingAvailability)) {
        //     if (!Object.keys(newObject).includes(date)) {
        //       newObject[date] = hour;
        //     }
        //   }
        // }
        // dataToStore = otherData.concat(newData);
      } else {
        dataToStore = [jsonData];
      }
      console.log(dataToStore);
      const newSchedule = await ctx.prisma.schedule.update({
        data: { attendees: dataToStore },
        where: { id: input.id },
      });
      return newSchedule;
    }),

  getUserAvailability: publicProcedure
    .input(z.object({ id: z.string(), user: z.string() }))
    .query(async ({ input, ctx }) => {
      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          attendees: { path: "$[*].user", array_contains: input.user },
        },
      });

      const convertedAvailability = schedule?.attendees as UserAvailability[];
      return convertedAvailability;
    }),
});
