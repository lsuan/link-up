import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { z } from "zod";
import {
  CalendarContainer,
  CalendarHeader,
  datePickerOpen,
} from "../components/form/DatePickerHelpers";
import { Form } from "../components/form/Form";
import { getTimeOptions } from "../utils/formHelpers";

type CreateScheduleInputs = {
  name: string;
  description?: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  startTime: number;
  endTime: number;
  timeZone: string;
  deadline?: Date;
  numberOfEvents: number;
  lengthOfEvents: string;
};

const CreateScheduleSchema = z.object({
  name: z.string().min(1, "Schedule name is required!"),
  description: z.string(),
  dateRange: z
    .object({
      startDate: z
        .date({ required_error: "Start date must be set!" })
        .min(new Date(), { message: "Start date must not be in the past!" }),
      endDate: z
        .date({ required_error: "End date must be set!" })
        .min(new Date(), { message: "End date must not be in the past!" }),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date!",
    }),
  startTime: z.number({ required_error: "Start time is required!" }),
  endTime: z.number({ required_error: "End time must be set!" }),
  timeZone: z.string({ required_error: "Timezone must be specified!" }),
  deadline: z
    .date()
    .min(new Date(), { message: "Deadline must not be in the past!" }),
  numberOfEvents: z
    .number()
    .min(1, { message: "You must have at least one event!" }),
  lengthOfEvents: z.string(),
});

type SubmitHandler = {};

function Create() {
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);

  const handleCalendarChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleSubmit = (data: SubmitHandler) => {
    console.log(data);
  };

  const getEventLengthOptions = () => {
    const mins: Array<string | number> = [
      15, 30, 45, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720,
      780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440,
    ];

    const options = mins.map((min) => {
      if (typeof min == "number" && min >= 60) {
        return `${min / 60} ${min / 60 === 1 ? "hour" : "hours"}`;
      } else {
        return `${min} mins`;
      }
    });
    return options;
  };

  const DatePickerInput = forwardRef(
    (
      { value, onClick }: { value?: string; onClick?: () => void },
      ref: any
    ) => (
      <div className="flex flex-col">
        <div className="relative">
          <button
            type="button"
            className="w-full rounded-lg border border-neutral-500 bg-neutral-900 px-4 py-2 text-left"
            onClick={onClick}
            ref={ref}
          >
            <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
            {value || "Select a date..."}
          </button>
          <label className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-neutral-900 px-2 text-xs text-white transition-all">
            Deadline to Fill By
          </label>
        </div>
      </div>
    )
  );

  return (
    <>
      <section className="px-8">
        {isDatePickerOpen && (
          <div
            className={
              "absolute top-0 left-0 z-50 h-full w-full overflow-hidden bg-neutral-700 opacity-90 blur-sm transition-all"
            }
          ></div>
        )}
        <h1 className="mb-12 text-3xl">Plan a Schedule</h1>
        <Form<CreateScheduleInputs, typeof CreateScheduleSchema>
          onSubmit={handleSubmit}
          schema={CreateScheduleSchema}
          className="flex flex-col gap-4"
        >
          <Form.Input
            name="name"
            displayName="Name"
            type="text"
            required={true}
          />
          {/* TODO: add tinymce integration */}
          <Form.Input
            name="description"
            displayName="Description"
            type="text"
          />
          {/* <Calendar /> */}
          <div className="relative mt-2 mb-4 rounded-lg bg-neutral-700 p-4 pb-3">
            {/* <label
              className="absolute left-1 top-0 z-20 ml-2 flex -translate-y-2 rounded-lg bg-neutral-900 px-2 text-xs text-white transition-all"
              htmlFor={"calendarDatePicker"}
            >
              How long should the schedule be?
              <span className="ml-1 text-red-500">*</span>
            </label> */}
            <DatePicker
              id="calendarDatePicker"
              selected={startDate}
              onChange={(dates) => handleCalendarChange(dates)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              dayClassName={(_) => "p-1 m-1 rounded-lg"}
              renderCustomHeader={CalendarHeader}
              showDisabledMonthNavigation
            />
          </div>

          <div className="flex justify-between gap-4">
            <Form.Select
              name="startTime"
              displayName="No Earlier Than"
              options={getTimeOptions()}
              value={"9:00 AM"}
              required={true}
            />
            <Form.Select
              name="endTime"
              displayName="No Later Than"
              value={"5:00 PM"}
              options={getTimeOptions()}
              required={true}
            />
          </div>
          <DatePicker
            selected={deadline}
            onChange={(date: Date) => setDeadline(date)}
            customInput={<DatePickerInput />}
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
          ></DatePicker>
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
          <Form.Submit name="Create Schedule" type="submit" />
        </Form>
      </section>
    </>
  );
}

export default Create;
