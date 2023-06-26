import CREATE_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/createAvailability";
import GET_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/getAvailability";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const availabilityRouter = router({
  /** Creates a new user availability for a given schedule. */
  createAvailability: protectedProcedure
    .input(CREATE_AVAILABILITY_API_SCHEMA)
    .mutation(async ({ input, ctx }) => {
      const { user, scheduleId, availability } = input;
      const newAvailability = await ctx.prisma.availability.create({
        data: {
          user,
          scheduleId,
          availability: JSON.parse(availability),
        },
      });
      return { availability: newAvailability };
    }),

  /** Retrieves the specific availability for a user based on the schedule. */
  getAvailability: publicProcedure
    .input(GET_AVAILABILITY_API_SCHEMA)
    .query(async ({ input, ctx }) => {
      const { user, scheduleId } = input;

      if (!user) {
        return { availability: null };
      }

      const availability = await ctx.prisma.availability.findFirst({
        where: {
          user,
          scheduleId,
        },
      });
      return { availability };
    }),
});

export default availabilityRouter;
