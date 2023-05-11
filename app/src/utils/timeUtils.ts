import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import zonedTimeToUtc from "date-fns-tz/zonedTimeToUtc";

interface TimezoneName {
  /**
   * The name of the timezone.
   * Ex: America/Los_Angeles
   */
  name: string;
  /**
   * Shortened version of `utcOffsetName`.
   * Used for user facing time labels.
   * Ex: PST, PDT, EST, EDT, etc.
   */
  abbreviation: string;
  /**
   * Full name of a UTC offset timezone name.
   * Ex: Pacific Standard Time, Eastern Daylight Time, etc.
   */
  utcOffsetName: string;
}

export const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const TIMEZONES = Intl.supportedValuesOf("timeZone") as readonly string[];

/** This is a list of all the timezones that are supported by the browser. */
export const TIMEZONE_NAMES: TimezoneName[] = TIMEZONES.map((timezone) => ({
  name: timezone,
  abbreviation: formatInTimeZone(new Date(), timezone, "zzz"),
  utcOffsetName: formatInTimeZone(new Date(), timezone, "zzzz"),
}));

/**
 * Returns a list of user facing timezone names with abbreviations.
 * Used for the timezone dropdown in the create schedule form.
 */
export const getTimezoneNames = (): string[] => {
  const timezoneNames = TIMEZONE_NAMES.map(
    (timezoneName) =>
      `${timezoneName.utcOffsetName} (${timezoneName.abbreviation})`
  );
  const uniqueNames = new Set(timezoneNames);

  return Array.from(uniqueNames).sort((firstTimezone, secondTimezone) =>
    firstTimezone.localeCompare(secondTimezone)
  );
};

export const getUtcOffsetName = (timezone: string): string => {
  const currentTimezoneName = TIMEZONE_NAMES.find(
    (timezoneName) => timezoneName.name === timezone
  )!;

  return `${currentTimezoneName.utcOffsetName} (${currentTimezoneName.abbreviation})`;
};

export const convertTime = (
  fromTimezone: string,
  toTimezone: string,
  date: Date
) => {
  const utcDate = zonedTimeToUtc(date, fromTimezone);
  return utcToZonedTime(utcDate, toTimezone);
};

export const getEventCardDateDisplay = (date: Date) =>
  Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  }).format(date);

export const getShortenedDateWithDay = (date: Date) =>
  Intl.DateTimeFormat("en-us", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
