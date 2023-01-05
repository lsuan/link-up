import { useAtom } from "jotai";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { getTimeOptions } from "../../../utils/formHelpers";
import {
  CalendarContainer,
  CalendarHeader,
  CustomDatePicker,
  datePickerOpen,
} from "../../form/DatePickerHelpers";
import { Form } from "../../form/Form";

type EditEventInputs = {
  eventName: string;
  eventDate: Date | null;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
};

const EditEventSchema = z.object({
  eventName: z.string({ required_error: "Event must have a name!" }),
  eventDate: z.date({ required_error: "Event must have a date!" }),
  startTime: z.string({ required_error: "Event must have a start time!" }),
  endTime: z.string({ required_error: "Event must have an end time!" }),
  location: z.string().optional(),
  description: z.string().optional(),
});

type EditEventResponse = {};
function EditEventCard({
  index,
  isEditing,
  setIsEditing,
}: {
  index: number;
  isEditing: boolean[];
  setIsEditing: (state: boolean[]) => void;
}) {
  const [, setIsDatePickerOpen] = useAtom(datePickerOpen);
  const [eventDate, setEventDate] = useState<Date | null>();

  const setCardEditState = () => {
    const prevCards = isEditing.slice(0, index);
    const rest = isEditing.slice(index + 1);
    setIsEditing([...prevCards, false, ...rest]);
  };

  const handleEventEdit = (data: EditEventResponse) => {
    setCardEditState();
    console.log(data);
  };

  return (
    <div className="rounded-lg bg-neutral-700 p-4">
      <Form<EditEventInputs, typeof EditEventSchema>
        schema={EditEventSchema}
        onSubmit={handleEventEdit}
        className="flex flex-col gap-4"
        defaultValues={{ eventDate }}
      >
        <Form.Input
          name="eventName"
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
            name="startTime"
            displayName="From"
            options={getTimeOptions()}
          />
          <Form.Select
            name="endTime"
            displayName="To"
            options={getTimeOptions()}
          />
        </div>
        <Form.Input name="location" displayName="Location" type="text" />
        <Form.Input name="description" displayName="Description" type="text" />
        <div className="flex justify-end gap-2">
          <Form.Button type="button" name="Delete" />
          <Form.Button type="submit" name="Save" />
        </div>
      </Form>
    </div>
  );
}

export default EditEventCard;
