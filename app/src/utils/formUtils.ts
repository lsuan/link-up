import { FieldError, FieldErrorsImpl } from "react-hook-form";

export const parseDeepErrors = (
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >,
  name: string
) => {
  if (Object.keys(errors).length === 0) return;
  const parsedName = name.split(".");
  if (parsedName.length <= 1) return errors[name]?.message;

  if (parsedName[0] && errors.hasOwnProperty(parsedName[0])) {
    const root = errors[parsedName[0]];
    if (root) {
      let children = "";
      for (let i = 1; i < parsedName.length; i++) {
        const child = parsedName[i] as string;
        if (root.hasOwnProperty(child)) {
          children += child;
        }
      }
      let innerObject = { message: "" };
      if (root.hasOwnProperty(children)) {
        innerObject = root[children as keyof FieldError] as any;
      }
      return root.message ? root.message : innerObject.message;
    }
  }
};

export const getTimeOptions = () => {
  const hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24,
  ];
  const formattedHours = getFormattedHours(hours, "long");
  return formattedHours;
};

export const getFormattedHours = (hours: number[], style: "long" | "short") => {
  const formattedHours = hours.map((hour) => {
    let format;
    if (hour > 12 && hour < 24) {
      format = `${hour - 12}x PM`;
    } else if (hour == 12) {
      format = "12x PM";
    } else if (hour == 0 || hour == 24) {
      format = "12x AM";
    } else {
      format = `${hour}x AM`;
    }
    return style === "long"
      ? format.replace("x", ":00")
      : format.replace("x", "");
  });
  return formattedHours;
};

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
];

export const MINUTES = [
  15, 30, 45, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780,
  840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440,
];
