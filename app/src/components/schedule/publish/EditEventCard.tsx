import { useAtom } from "jotai";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { type InitialEventInfo } from "../../../pages/schedule/[slug]/publish";
import { getHourNumber } from "../../../utils/availabilityUtils";
import { getTimeOptions } from "../../../utils/formUtils";
import CustomDatePicker, {
  CalendarContainer,
  CalendarHeader,
  datePickerOpen,
} from "../../form/DatePickerHelpers";
import Form from "../../form/Form";
import ModalBackground from "../../shared/ModalBackground";

const EditEventSchema = z.object({
  name: z.string().min(1, { message: "Event must have a name!" }),
  date: z.date({ invalid_type_error: "Event must have a date!" }),
  times: z
    .object({
      startTime: z.string({ required_error: "Event must have a start time!" }),
      endTime: z.string({ required_error: "Event must have an end time!" }),
    })
    .refine(
      (data) => getHourNumber(data.startTime) < getHourNumber(data.endTime),
      "End time must be later than start time!"
    ),
  location: z.string().optional(),
  description: z.string().optional(),
});

type EditEventInputs = {
  name: string;
  date: Date;
  times: {
    startTime: string;
    endTime: string;
  };
  location: string;
  description: string;
};

function EditEventCard({
  index,
  events,
  scheduleStartTime,
  scheduleEndTime,
  setEvents,
  deleteEvent,
  className,
}: {
  index: number;
  events: InitialEventInfo[];
  scheduleStartTime: string;
  scheduleEndTime: string;
  setEvents: (events: InitialEventInfo[]) => void;
  deleteEvent: (index: number) => void;
  className?: string;
}) {
  const event = events[index] as InitialEventInfo;
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  const [eventDate, setEventDate] = useState<Date | null>(event.date);
  const eventStartTime = getHourNumber(scheduleStartTime);
  const eventEndTime = getHourNumber(scheduleEndTime);
  const selectOptions = getTimeOptions(eventStartTime, eventEndTime);

  const handleEventSave = async (data: EditEventInputs) => {
    const eventData: InitialEventInfo = {
      name: data.name,
      date: data.date,
      startTime: data.times.startTime,
      endTime: data.times.endTime,
      description: data.description,
      location: data.location,
      isEditing: false,
    };

    const prevEvents = events.slice(0, index);
    const rest = events.slice(index + 1);
    setEvents([...prevEvents, eventData, ...rest]);
  };

  return (
    <>
      <ModalBackground isModalOpen={isDatePickerOpen} />
      <div className={`rounded-lg bg-neutral-700 p-4${className}`}>
        <Form<EditEventInputs, typeof EditEventSchema>
          schema={EditEventSchema}
          onSubmit={handleEventSave}
          className="flex flex-col gap-4"
          defaultValues={{
            name: event.name,
            date: eventDate,
            times: { startTime: event.startTime, endTime: event.endTime },
            location: event?.location,
            description: event?.description,
          }}
        >
          <Form.Input
            name="name"
            displayName="Event Name"
            type="text"
            required
          />
          <DatePicker
            selected={eventDate}
            onChange={(date) => setEventDate(date)}
            customInput={<CustomDatePicker label="Date" star />}
            calendarContainer={({ children }) => (
              <CalendarContainer
                title="When should this event occur?"
                className="border border-neutral-500"
                required
              >
                {children}
              </CalendarContainer>
            )}
            onCalendarOpen={() => setIsDatePickerOpen(true)}
            onCalendarClose={() => setIsDatePickerOpen(false)}
            dayClassName={() => "p-1 m-1 rounded-lg"}
            renderCustomHeader={CalendarHeader}
            showDisabledMonthNavigation
          />
          <Form.Input type="hidden" name="date" displayName="Date" />
          <div className="flex justify-between gap-2">
            <Form.Select
              name="times.startTime"
              displayName="From"
              options={selectOptions}
              required
            />
            <Form.Select
              name="times.endTime"
              displayName="To"
              options={selectOptions}
              required
            />
          </div>
          <Form.Input name="location" displayName="Location" type="text" />
          <Form.Input
            name="description"
            displayName="Description"
            type="text"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg bg-neutral-500 py-2 px-4"
              onClick={() => deleteEvent(index)}
            >
              Delete
            </button>
            <Form.Button type="submit" name="Save" />
          </div>
        </Form>
      </div>
    </>
  );
}

export default EditEventCard;
