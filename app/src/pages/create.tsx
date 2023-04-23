import PageContainer from "@ui/PageContainer";
import { notice } from "@ui/Snackbar";
import Typography from "@ui/Typography";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import { type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
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
import {
  MAX_DESCRIPTION_LENGTH,
  MINUTES,
  TIMEZONES,
  getTimeOptions,
} from "../utils/formUtils";
import { createSlug } from "../utils/scheduleUtils";
import { CREATE_SCHEDULE_FORM_SCHEMA } from "../utils/schemas";
import { trpc } from "../utils/trpc";

type CreateScheduleInputs = z.infer<typeof CREATE_SCHEDULE_FORM_SCHEMA>;

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

const LENGTH_OF_EVENTS_OPTIONS = Object.values(MINUTES);
const LENGTH_OF_EVENTS_VALUES = Object.keys(MINUTES).map((minutes) =>
  Number(minutes)
);

function Create() {
  const { status } = useSession();
  const { mutateAsync } = trpc.schedule.createSchedule.useMutation();
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
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
      timezone,
    } = inputs;
    const { startDate, isOneDay } = inputs.dateRange as {
      startDate: Date;
      isOneDay: boolean;
    };

    const endDate = isOneDay ? startDate : inputs.dateRange.endDate!;

    await mutateAsync(
      {
        scheduleName,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        isOneDay,
        timezone,
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

  const handleOneDayChange = useCallback(() => {
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
  }, [
    defaultValues.dateRange.startDate,
    defaultValues.dateRange.isOneDay,
    defaultValues.dateRange.endDate,
  ]);

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
      <Form<CreateScheduleInputs, typeof CREATE_SCHEDULE_FORM_SCHEMA>
        onSubmit={handleSubmit}
        schema={CREATE_SCHEDULE_FORM_SCHEMA}
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
            options={LENGTH_OF_EVENTS_OPTIONS}
            values={LENGTH_OF_EVENTS_VALUES}
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
