import CREATE_AVAILABILITY_API_SCHEMA from "../../../utils/schemas/createAvailability";
import { protectedProcedure, router } from "../trpc";

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
});

export default availabilityRouter;
