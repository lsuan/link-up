import { z } from "zod";

const MAX_SCHEDULE_RANGE = 30;

/** Used for the frontend form in the create schedule page. */
export const CREATE_SCHEDULE_FORM_SCHEMA = z.object({
  scheduleName: z.string().min(1, "Schedule name is required!"),
  description: z
    .string()
    .max(200, "Description cannot be longer than 200 characters.")
    .optional(),
  dateRange: z
    .object({
      startDate: z
        .date({ invalid_type_error: "Start date must be set!" })
        .min(new Date(), { message: "Start date must not be in the past!" }),
      endDate: z.date().nullish(),
      isOneDay: z.boolean(),
    })
    .refine((data) => data.isOneDay || data.endDate, {
      path: ["isOneDay"],
      message: "Check the 'One Day Schedule' or set an end date!",
    })
    .refine((data) => (data.endDate ? data.endDate > data.startDate : true), {
      path: ["endDate"],
      message: "End date must be later than the start date!",
    })
    .refine(
      (data) => {
        // pass the check if the end date isn't set yet
        if (!data.endDate) {
          return true;
        }
        const timeDifferenceMs = Math.abs(
          data.endDate.getTime() - data.startDate.getTime()
        );
        const dayDifference = Math.ceil(
          timeDifferenceMs / (1000 * 60 * 60 * 24)
        );
        return dayDifference < MAX_SCHEDULE_RANGE;
      },
      {
        path: ["endDate"],
        message: "The max range for a schedule is 30 days!",
      }
    ),
  startTime: z.string({ required_error: "Start time is required!" }),
  endTime: z.string({ required_error: "End time must be set!" }),
  timezone: z.string({ required_error: "Timezone must be set!" }),
  deadline: z
    .date()
    .min(new Date(), { message: "Deadline must not be in the past!" })
    .nullish()
    .optional(),
  numberOfEvents: z
    .number()
    .min(1, { message: "You must have at least one event!" }),
  lengthOfEvents: z.number(),
});

/** Used for validation in the schedule API. */
export const CREATE_SCHEDULE_API_SCHEMA = z.object({
  scheduleName: z.string().min(1, "Schedule name is required!"),
  description: z
    .string()
    .max(200, "Description cannot be longer than 200 characters.")
    .optional(),
  startDate: z
    .date({ invalid_type_error: "Start date must be set!" })
    .min(new Date(), { message: "Start date must not be in the past!" }),
  endDate: z.date(),
  isOneDay: z.boolean(),
  startTime: z.string({ required_error: "Start time is required!" }),
  endTime: z.string({ required_error: "End time must be set!" }),
  timezone: z.string({ required_error: "Timezone must be set!" }),
  deadline: z
    .date()
    .min(new Date(), { message: "Deadline must not be in the past!" })
    .nullish()
    .optional(),
  numberOfEvents: z
    .number()
    .min(1, { message: "You must have at least one event!" }),
  lengthOfEvents: z.number(),
});
