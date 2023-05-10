import { formatInTimeZone } from "date-fns-tz";
import { type FieldErrorsImpl } from "react-hook-form";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

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

export const getUtcOffsetNameFromTimezone = (
  timezone: string
): string | undefined => {
  const currentTimezoneName = TIMEZONE_NAMES.find(
    (timezoneName) => timezoneName.name === timezone
  );
  if (!currentTimezoneName) {
    return undefined;
  }

  return `${currentTimezoneName.utcOffsetName} (${currentTimezoneName.abbreviation})`;
};

const HOURS: readonly number[] = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
  9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17,
  17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24,
] as const;

export type PasswordCondition = {
  regex: RegExp;
  message: string;
  isFulFilled: boolean;
};

export const MINUTES = {
  30: "30 mins",
  60: "1 hour",
  120: "2 hours",
  180: "3 hours",
  240: "4 hours",
  300: "5 hours",
  360: "6 hours",
  420: "7 hours",
  480: "8 hours",
  540: "9 hours",
  600: "10 hours",
  660: "11 hours",
  720: "12 hours",
  780: "13 hours",
  840: "14 hours",
  900: "15 hours",
  960: "16 hours",
  1020: "17 hours",
  1080: "18 hours",
  1140: "19 hours",
  1200: "20 hours",
  1260: "21 hours",
  1320: "22 hours",
  1380: "23 hours",
  1440: "24 hours",
} as const;

// eslint-disable-next-line no-useless-escape
export const EMAIL_REGEX = /[\w]+@[a-z]+[\.][a-z]+/;
export const PASSWORD_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]{8,}$/g;
export const PASSWORD_REGEX_CONDITIONS: PasswordCondition[] = [
  {
    regex: /^.{8,}$/g,
    message: "A minimum length of 8 characters",
    isFulFilled: false,
  },
  {
    regex: /^.*[a-z].*$/g,
    message: "At least 1 lowercase letter",
    isFulFilled: false,
  },
  {
    regex: /^.*[A-Z].*$/g,
    message: "At least 1 uppercase letter",
    isFulFilled: false,
  },
  { regex: /^.*\d.*$/g, message: "At least 1 number", isFulFilled: false },
  {
    // eslint-disable-next-line no-useless-escape
    regex: /^.*[!@#\$%\^&\*].*$/g,
    message: "At least 1 special character",
    isFulFilled: false,
  },
];

/** Recurses through the errors object to find the specific error message. */
const parse = (
  parsedNames: string[],
  errors: Record<string, unknown>
): unknown => {
  if ("message" in errors) {
    return errors.message;
  }
  const key = parsedNames.filter((name) => name in errors)[0] as string;
  const root = errors[key] as Record<string, unknown>;
  if (root) {
    return parse(parsedNames, root);
  }
};

/** Gets the detailed errors from input fields that are objects. */
export const parseDeepErrors = (
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: unknown;
    }>
  >,
  name: string
) => {
  if (Object.keys(errors).length === 0) return;
  const parsedNames = name.split(".");
  return parse(parsedNames, errors) ?? undefined;
};

/** Converts an array of numbers representing hours into a formatted string.
 *
 * Ex. [23, 24] returns ["11:00 PM", "11:59 PM"]
 */
export const getFormattedHours = (hours: number[], style: "long" | "short") => {
  const formattedHours = hours.map((hour) => {
    let format;
    if (hour >= 13 && hour < 24) {
      format = `${
        !Number.isInteger(hour) ? `${hour - 12.5}:30 PM` : `${hour - 12}x PM`
      }`;
    } else if (hour === 12) {
      format = "12x PM";
    } else if (hour === 12.5) {
      format = "12:30 PM";
    } else if (hour === 0.5) {
      format = "12:30 AM";
    } else if (hour === 0) {
      format = "12x AM";
    } else if (hour === 24) {
      // semantically change 12 AM to 11:59 PM since 12 AM is the start of the next day
      format = "11:59 PM";
    } else {
      format = `${
        !Number.isInteger(hour) ? `${hour - 0.5}:30 AM` : `${hour}x AM`
      }`;
    }
    return style === "long"
      ? format.replace("x", ":00")
      : format.replace("x", "");
  });
  return formattedHours;
};

/** Returns all the available time options from 12 AM to 11:59 PM.
 * Takes optional parameters to specify the range of times for a given select element.
 */
export const getTimeOptions = (
  start = 0,
  end: number | undefined = undefined
) => {
  const startIndex = HOURS.findIndex((hour) => hour === start);
  const endIndex = end
    ? HOURS.findIndex((hour) => hour === end) + 1
    : undefined;
  const formattedHours = getFormattedHours(
    HOURS.slice(startIndex, endIndex),
    "long"
  );
  return formattedHours;
};

// Max character limit on schedule descriptions.
export const MAX_DESCRIPTION_LENGTH = 200;
