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

export const MINUTES = [
  30, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900,
  960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440,
] as const;

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
