import { JSONArray, JSONObject } from "superjson/dist/types";
import { z } from "zod";
import { AttendeeAvailability } from "../../../components/schedule/AvailbilityResponses";
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
   * { "user", "availability": {"date": []}}
   */

  setAvailability: publicProcedure
    .input(z.object({ id: z.string(), attendee: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const jsonData = JSON.parse(input.attendee);

      const schedule = await ctx.prisma.schedule.findFirst({
        where: {
          id: input.id,
          // attendees: {
          //   path: `[*].user`,
          //   string_contains: jsonData["user"],
          // },
        },
      });
      // console.log(scheduleWithPreviousUserAvailability);
      let prevData = schedule?.attendees as JSONObject;
      // console.log("prevData", prevData);
      let dataToStore;
      if (Object.keys(prevData).length > 0) {
        // for (let [user, availability] of Object.entries(prevData)) {
        //   if (user === input.id) {
        //     availability = jsonData["availability"];
        //   } else {
        //     for (const [newUser, newAvailability] of Object.entries(jsonData)) {
        //       const newData = JSON.stringify(newAvailability);
        //       prevData = {
        //         ...prevData,
        //         newUser: {
        //           availability: JSON.parse(newData),
        //         },
        //       };
        //     }
        //   }
        // }
        const found = Object.keys(prevData).find(
          (entry) => entry === jsonData["user"]
        );
        if (found) {
          dataToStore = JSON.parse(
            `{"${jsonData["user"]}": {"availability": ${JSON.stringify(
              jsonData["availability"]
            )}}}`
          );
        } else {
          const newData = JSON.stringify(jsonData["availability"]).substring(1); // gets rid of beginning curly brace
          const prevDataString = JSON.stringify(jsonData);
          dataToStore = JSON.parse(
            prevDataString.substring(prevDataString.length - 1) + "," + newData
          );
        }
      } else {
        dataToStore = JSON.parse(
          `{"${jsonData["user"]}": {"availability": ${JSON.stringify(
            jsonData["availability"]
          )}}}`
        );
      }
      console.log(dataToStore);
      const newSchedule = await ctx.prisma.schedule.update({
        data: { attendees: dataToStore },
        where: { id: input.id },
      });
      console.log(newSchedule);
      return newSchedule;
    }),

  // getUserAvailability: publicProcedure.input(z.string()).query()
});
