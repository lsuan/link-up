import { CalendarDays } from "../../../utils/availabilityUtils";
import GET_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/getAvailability";
import SET_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/setAvailability";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const availabilityRouter = router({
  /**
   * Creates a new user availability or updates an existing user availability
   * for a given schedule.
   */
  setAvailability: publicProcedure
    .input(SET_AVAILABILITY_API_SCHEMA)
    .mutation(async ({ input, ctx }) => {
      const { userId, name, scheduleId, availability } = input;

      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          userId,
          name,
          scheduleId,
        },
      });

      if (existingAvailability) {
        const updatedAvailability = await ctx.prisma.availability.update({
          where: {
            id: existingAvailability.id,
          },
          data: {
            availability: JSON.parse(availability),
          },
        });
        return { availability: updatedAvailability };
      }

      const newAvailability = await ctx.prisma.availability.create({
        data: {
          userId,
          name,
          scheduleId,
          availability: JSON.parse(availability),
        },
      });
      return { availability: newAvailability };
    }),

  // TODO: change this from a query in the api to a check in the client
  // no need to create another query if we can use the data we already have on the client
  /** Retrieves the specific availability for a user based on the schedule. */
  // getAvailability: publicProcedure
  //   .input(GET_AVAILABILITY_API_SCHEMA)
  //   .query(async ({ input, ctx }) => {
  //     const { user, scheduleId } = input;

  //     if (!user) {
  //       return { availability: null };
  //     }

  //     const availability = await ctx.prisma.availability.findFirst({
  //       where: {
  //         user,
  //         scheduleId,
  //       },
  //     });
  //     return { availability };
  //   }),
});

export default availabilityRouter;
