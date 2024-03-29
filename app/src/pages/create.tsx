import PageContainer from "@ui/PageContainer";
import { notice } from "@ui/Snackbar";
import Typography from "@ui/Typography";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import CustomDatePicker, {
  CalendarContainer,
  CalendarHeader,
  datePickerOpen,
} from "../components/form/DatePickerHelpers";
import Form from "../components/form/Form";
import BackArrow from "../components/shared/BackArrow";
import Loading from "../components/shared/Loading";
import ModalBackground from "../components/shared/ModalBackground";
import Unauthenticated from "../components/shared/Unauthenticated";
import { pageTitle } from "../layouts/Layout";
import {
  getTimeOptions,
  MAX_DESCRIPTION_LENGTH,
  MINUTES,
  TIMEZONES,
} from "../utils/formUtils";
import { createSlug } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

const MAX_SCHEDULE_RANGE = 30;

type CreateScheduleInputs = {
  scheduleName: string;
  description?: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
    isOneDay: boolean;
  };
  startTime: string;
  endTime: string;
  timezone: string;
  deadline?: Date | null;
  numberOfEvents: number;
  lengthOfEvents: string;
};

/** These are the only inputs that should be set by date pickers or set by default. */
type ControlledScheduleInputs = {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
    isOneDay: boolean;
  };
  startTime: string;
  endTime: string;
  timezone: string;
  deadline?: Date | null;
};

const CreateScheduleSchema = z.object({
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
    .optional(),
  numberOfEvents: z
    .number()
    .min(1, { message: "You must have at least one event!" }),
  lengthOfEvents: z.string(),
});

function Create() {
  const { status } = useSession();
  const { mutateAsync } = trpc.schedule.createSchedule.useMutation();
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  const [, setTitle] = useAtom(pageTitle);
  setTitle("Plan A Schedule | LinkUp");
  const [, setNoticeMessage] = useAtom(notice);
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<ControlledScheduleInputs>({
    dateRange: { startDate: new Date(), endDate: null, isOneDay: false },
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const handleSubmit: SubmitHandler<CreateScheduleInputs> = async (inputs) => {
    const {
      scheduleName,
      description,
      startTime,
      endTime,
      deadline,
      numberOfEvents,
      lengthOfEvents,
    } = inputs;

    const name = scheduleName.trim();

    const { startDate, isOneDay } = inputs.dateRange as {
      startDate: Date;
      isOneDay: boolean;
    };

    let { endDate } = inputs.dateRange as {
      endDate: Date;
    };

    if (isOneDay) {
      endDate = startDate;
    }

    await mutateAsync(
      {
        name,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        deadline,
        numberOfEvents,
        lengthOfEvents,
      },
      {
        onSuccess: (data) => {
          const { name: currentName, id } = data.schedule;
          const slug = createSlug(currentName, id);
          router.push(`schedule/${slug}`);
          setNoticeMessage({
            action: "close",
            icon: "check",
            message: "Your schedule has been successfully created!",
          });
        },
      }
    );
  };

  const handleOneDayChange = () => {
    const { startDate, isOneDay } = defaultValues.dateRange;
    if (isOneDay) {
      setDefaultValues({
        ...defaultValues,
        dateRange: {
          ...defaultValues.dateRange,
          isOneDay: false,
        },
      });
    } else {
      setDefaultValues({
        ...defaultValues,
        dateRange: {
          startDate,
          endDate: null,
          isOneDay: true,
        },
      });
    }
  };

  const getEventLengthOptions = () => {
    const mins = [...MINUTES];

    const options = mins.map((min) => {
      if (min >= 60) {
        return `${min / 60} ${min / 60 === 1 ? "hour" : "hours"}`;
      }
      return `${min} mins`;
    });
    return options;
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <PageContainer>
      <BackArrow href="/dashboard" page="Dashboard" />
      <ModalBackground isModalOpen={isDatePickerOpen} />
      <Typography intent="h1" className="mb-12">
        Plan a Schedule
      </Typography>
      <Form<CreateScheduleInputs, typeof CreateScheduleSchema>
        onSubmit={handleSubmit}
        schema={CreateScheduleSchema}
        className="flex flex-col gap-4"
        defaultValues={defaultValues}
      >
        <Form.Input
          name="scheduleName"
          displayName="Name"
          type="text"
          required
        />
        {/* TODO: add tinymce integration */}
        <Form.TextArea
          name="description"
          displayName="Description"
          maxLength={MAX_DESCRIPTION_LENGTH}
        />

        <div className="relative rounded-lg bg-neutral-100 p-4">
          {defaultValues.dateRange.isOneDay && (
            <div className="absolute top-0 left-0 z-30 h-full w-full rounded-lg bg-brand-100 opacity-50" />
          )}
          <DatePicker
            id="calendarDatePicker"
            selected={defaultValues.dateRange.startDate}
            onChange={(dates) =>
              setDefaultValues({
                ...defaultValues,
                dateRange: {
                  startDate: dates[0],
                  endDate: dates[1],
                  isOneDay: false,
                },
              })
            }
            startDate={defaultValues.dateRange.startDate}
            endDate={defaultValues.dateRange.endDate}
            selectsRange
            inline
            dayClassName={() => "p-1 m-1 cursor-pointer rounded-lg"}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <CalendarHeader
                date={date}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
                prevMonthButtonDisabled={prevMonthButtonDisabled}
                nextMonthButtonDisabled={nextMonthButtonDisabled}
              />
            )}
            disabled={defaultValues.dateRange.isOneDay}
            disabledKeyboardNavigation={defaultValues.dateRange.isOneDay}
            ariaInvalid={defaultValues.dateRange.isOneDay ? "true" : "false"}
          />
        </div>
        <Form.Input
          type="hidden"
          name="dateRange.endDate"
          displayName="End Date"
        />
        {!defaultValues.dateRange.isOneDay &&
          defaultValues.dateRange.endDate && (
            <p>{`Current Schedule Range: ${defaultValues.dateRange.startDate?.toLocaleDateString()} — ${defaultValues.dateRange.endDate?.toLocaleDateString()}`}</p>
          )}
        <Form.Checkbox
          name="dateRange.isOneDay"
          label="One Day Schedule?"
          onClick={() => handleOneDayChange()}
          tooltipText="If your schedule range is only one day, select this option."
        />

        <div className="flex justify-between gap-4">
          <Form.Select
            name="startTime"
            displayName="No Earlier Than"
            options={getTimeOptions()}
            required
            tooltipText="You can specify the timeframe that each day of your schedule will accept availabilities from."
          />
          <Form.Select
            name="endTime"
            displayName="No Later Than"
            options={getTimeOptions()}
            required
            tooltipText="You can specify the timeframe that each day of your schedule will accept availabilities from."
          />
        </div>
        <Form.SearchableSelect
          name="timezone"
          displayName="Timezone"
          options={TIMEZONES}
          required
        />
        {/* TODO: add custom header with custom title */}
        <DatePicker
          selected={defaultValues.deadline}
          onChange={(date) =>
            setDefaultValues({ ...defaultValues, deadline: date })
          }
          customInput={<CustomDatePicker label="Deadline to fill by" />}
          calendarContainer={CalendarContainer}
          onCalendarOpen={() => setIsDatePickerOpen(true)}
          onCalendarClose={() => setIsDatePickerOpen(false)}
          dayClassName={() => "p-1 m-1 rounded-lg"}
          renderCustomHeader={CalendarHeader}
          showDisabledMonthNavigation
        />

        <div className="flex justify-between gap-4">
          <Form.Select
            name="numberOfEvents"
            displayName="Number of Events"
            options={[1, 2, 3, 4, 5]}
            required
            tooltipText="A schedule is made up of events. You can specify how many events you would like the schedule to have."
          />
          <Form.Select
            name="lengthOfEvents"
            displayName="Length of Events"
            options={getEventLengthOptions()}
            required
            tooltipText="A schedule is made up of events. You can specify how long you would like each event to be."
          />
        </div>
        <Form.Button name="Create Schedule" type="submit" />
      </Form>
    </PageContainer>
  );
}

export default Create;
