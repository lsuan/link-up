/* eslint-disable import/prefer-default-export */
import { getHourNumber } from "./availabilityUtils";

/**
 * Adds a specific event with its attributes as parameters with the user's access token.
 * Date is in ISO format.
 * Times are in TT:TT XM format.
 */
export const handleGoogleCalendar = (
  accessToken: string,
  name: string,
  date: string,
  description: string,
  startTime: string,
  endTime: string,
  location: string
) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const startHour = getHourNumber(startTime);
  const endHour = getHourNumber(endTime);
  const convertedStart = !Number.isInteger(startHour)
    ? `${startHour - 0.5}:30`
    : `${startHour.toString()}:00`;
  const convertedEnd = !Number.isInteger(endHour)
    ? `${endHour - 0.5}:30`
    : `${endHour.toString()}:00`;
  if (!Number.isInteger(startHour)) {
    `${endHour - 0.5}:30`;
  }
  const start = `${date}T${convertedStart.padStart(5, "0")}:00`;
  const end = `${date}T${convertedEnd.padEnd(5, "0")}:00`;
  const googleEvent = {
    summary: name,
    location,
    description,
    start: {
      dateTime: start,
      timeZone,
    },
    end: {
      dateTime: end,
      timeZone,
    },
    // Id for "Lavender"
    colorId: "1",
  };

  return fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(googleEvent),
    }
  ).then((data) => data.json());
};
