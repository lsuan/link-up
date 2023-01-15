import { Event } from "@prisma/client";
import { useAtom } from "jotai";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { notice } from "../../../pages/schedule/[slug]";
import { InitialEventInfo } from "../../../pages/schedule/[slug]/publish";
import { getTimeFromString, getTimeOptions } from "../../../utils/formUtils";
import { trpc } from "../../../utils/trpc";
import {
  CalendarContainer,
  CalendarHeader,
  CustomDatePicker,
  datePickerOpen,
} from "../../form/DatePickerHelpers";
import { Form } from "../../form/Form";
import ModalBackground from "../../shared/ModalBackground";

const EditEventSchema = z.object({
  name: z.string().min(1, { message: "Event must have a name!" }),
  date: z.date({ required_error: "Event must have a date!" }),
  times: z
    .object({
      startTime: z.string({ required_error: "Event must have a start time!" }),
      endTime: z.string({ required_error: "Event must have an end time!" }),
    })
    .refine(
      (data) =>
        getTimeFromString(data.startTime) < getTimeFromString(data.endTime),
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
  event,
  index,
  isEditing,
  setIsEditing,
  scheduleId,
}: {
  event: InitialEventInfo | Event;
  index: number;
  isEditing: boolean[];
  setIsEditing: (state: boolean[]) => void;
  scheduleId: string;
}) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  const [eventDate, setEventDate] = useState<Date | null>(event.date);
  const createEvent = trpc.event.createEvent.useMutation();
  const [, setNoticeMessage] = useAtom(notice);

  const setCardEditState = () => {
    const prevCards = isEditing.slice(0, index);
    const rest = isEditing.slice(index + 1);
    setIsEditing([...prevCards, false, ...rest]);
  };

  const handleEventEdit = async (data: EditEventInputs) => {
    const eventData: InitialEventInfo = {
      name: data.name,
      date: data.date,
      startTime: data.times.startTime,
      endTime: data.times.endTime,
      description: data.description,
      location: data.location,
    };
    const newEvent = await createEvent.mutateAsync({
      ...eventData,
      scheduleId,
    });

    if (newEvent) {
      setCardEditState();
      setNoticeMessage("Event successfully updated.");
    }
  };

  return (
    <>
      <ModalBackground isModalOpen={isDatePickerOpen} />
      <div className="rounded-lg bg-neutral-700 p-4">
        <Form<EditEventInputs, typeof EditEventSchema>
          schema={EditEventSchema}
          onSubmit={handleEventEdit}
          className="flex flex-col gap-4"
          defaultValues={{
            name: event.name,
            date: event.date,
            times: { startTime: event.startTime, endTime: event.endTime },
            location: event.location,
            description: event.description,
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
            customInput={<CustomDatePicker label="Date" required />}
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
            dayClassName={(_) => "p-1 m-1 rounded-lg"}
            renderCustomHeader={CalendarHeader}
            showDisabledMonthNavigation
          />
          <div className="flex justify-between gap-2">
            <Form.Select
              name="times.startTime"
              displayName="From"
              options={getTimeOptions()}
            />
            <Form.Select
              name="times.endTime"
              displayName="To"
              options={getTimeOptions()}
            />
          </div>
          <Form.Input name="location" displayName="Location" type="text" />
          <Form.Input
            name="description"
            displayName="Description"
            type="text"
          />
          <div className="flex justify-end gap-2">
            <Form.Button type="button" name="Delete" />
            <Form.Button type="submit" name="Save" />
          </div>
        </Form>
      </div>
    </>
  );
}

export default EditEventCard;
