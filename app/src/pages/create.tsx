import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  CalendarContainer,
  CalendarHeader,
  CustomDatePicker,
  datePickerOpen,
} from "../components/form/DatePickerHelpers";
import { Form } from "../components/form/Form";
import BackArrow from "../components/shared/BackArrow";
import ModalBackground from "../components/shared/ModalBackground";
import { getTimeOptions, MINUTES } from "../utils/formHelpers";
import { trpc } from "../utils/trpc";
import { notice } from "./schedule/[slug]";

type CreateScheduleInputs = {
  scheduleName: string;
  description: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  startTime: string;
  endTime: string;
  timeZone: string;
  deadline?: Date | null;
  numberOfEvents: number;
  lengthOfEvents: string;
};

const CreateScheduleSchema = z.object({
  scheduleName: z.string().min(1, "Schedule name is required!"),
  description: z.string().optional(),
  dateRange: z
    .object({
      startDate: z
        .date({ invalid_type_error: "Start date must be set!" })
        .min(new Date(), { message: "Start date must not be in the past!" }),
      endDate: z
        .date({ invalid_type_error: "End date must be set!" })
        .min(new Date(), { message: "End date must not be in the past!" }),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date!",
    }),
  startTime: z.string({ required_error: "Start time is required!" }),
  endTime: z.string({ required_error: "End time must be set!" }),
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
  const { data: sessionData } = useSession();
  const createSchedule = trpc.schedule.createSchedule.useMutation();
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  const [, setNoticeMessage] = useAtom(notice);
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({
    dateRange: { startDate: new Date(), endDate: null },
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    numberOfEvents: 1,
    lengthOfEvents: "1 hour",
  });

  const handleSubmit: SubmitHandler<CreateScheduleInputs> = async (data) => {
    const {
      scheduleName: name,
      description,
      startTime,
      endTime,
      deadline,
      numberOfEvents,
      lengthOfEvents,
    } = data;
    const { startDate, endDate } = data.dateRange as {
      startDate: Date;
      endDate: Date;
    };
    const userId = sessionData?.user?.id as string;

    const res = await createSchedule.mutateAsync({
      name,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      deadline,
      numberOfEvents,
      lengthOfEvents,
      userId,
    });

    if (res) {
      const { name, id } = res.schedule;
      const joinedName = name.toLowerCase().split(" ").join("-");
      const lastOfId = res.schedule.id.substring(id.length - 8);
      const slug = `${joinedName}-${lastOfId}`;
      setNoticeMessage("Your schedule has successfully been created!");
      router.push(`schedule/${slug}`);
    }
  };

  const getEventLengthOptions = () => {
    const mins = [...MINUTES];

    const options = mins.map((min) => {
      if (typeof min == "number" && min >= 60) {
        return `${min / 60} ${min / 60 === 1 ? "hour" : "hours"}`;
      } else {
        return `${min} mins`;
      }
    });
    return options;
  };

  // TODO: add defaultValues + account for datepicker values
  return (
    <section className="px-8">
      <BackArrow href="/dashboard" page="Dashboard" />
      <ModalBackground isModalOpen={isDatePickerOpen} />
      <h1 className="mb-12 text-3xl">Plan a Schedule</h1>
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
          required={true}
        />
        {/* TODO: add tinymce integration */}
        <Form.Input name="description" displayName="Description" type="text" />

        <div className="relative mt-2 mb-4 rounded-lg bg-neutral-700 p-4 pb-3">
          {/* uncomment for disabled if we need this functionality */}
          {/* <div className="absolute top-0 left-0 z-30 h-full w-full rounded-lg bg-neutral-700 opacity-50" /> */}
          <DatePicker
            id="calendarDatePicker"
            selected={defaultValues.dateRange.startDate}
            onChange={(dates) =>
              setDefaultValues({
                ...defaultValues,
                dateRange: { startDate: dates[0], endDate: dates[1] },
              })
            }
            startDate={defaultValues.dateRange.startDate}
            endDate={defaultValues.dateRange.endDate}
            selectsRange
            inline
            dayClassName={(_) => "p-1 m-1 rounded-lg"}
            renderCustomHeader={CalendarHeader}
          />
        </div>

        <div className="flex justify-between gap-4">
          <Form.Select
            name="startTime"
            displayName="No Earlier Than"
            options={getTimeOptions()}
            required={true}
          />
          <Form.Select
            name="endTime"
            displayName="No Later Than"
            options={getTimeOptions()}
            required={true}
          />
        </div>
        <DatePicker
          selected={defaultValues.deadline}
          onChange={(date) =>
            setDefaultValues({ ...defaultValues, deadline: date })
          }
          customInput={
            <CustomDatePicker label="Deadline to fill by"></CustomDatePicker>
          }
          calendarContainer={({ children }) => (
            <CalendarContainer
              title={"When should attendees send their availability by?"}
              className="border border-neutral-500"
            >
              {children}
            </CalendarContainer>
          )}
          onCalendarOpen={() => setIsDatePickerOpen(true)}
          onCalendarClose={() => setIsDatePickerOpen(false)}
          dayClassName={(_) => "p-1 m-1 rounded-lg"}
          renderCustomHeader={CalendarHeader}
          showDisabledMonthNavigation
        />

        <div className="flex justify-between gap-4">
          <Form.Select
            name="numberOfEvents"
            displayName="Number of Events"
            options={[1, 2, 3, 4, 5]}
            required={true}
          />
          <Form.Select
            name="lengthOfEvents"
            displayName="Length of Events"
            options={getEventLengthOptions()}
            required={true}
          />
        </div>
        <Form.Button name="Create Schedule" type="submit" />
      </Form>
    </section>
  );
}

export default Create;
