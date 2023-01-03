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
  console.log(errors);

  const parsedName = name.split(".");
  if (parsedName.length <= 1) return errors[name]?.message;

  if (parsedName[0] && errors.hasOwnProperty(parsedName[0])) {
    const root = errors[parsedName[0]];
    if (root) {
      console.log(root);
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

  const formattedHours = hours.map((hour) => {
    if (hour > 12 && hour < 24) {
      return `${hour - 12}:00 PM`;
    } else if (hour == 12) {
      return "12:00 PM";
    } else if (hour == 0 || hour == 24) {
      return "12:00 AM";
    } else {
      return `${hour}:00 AM`;
    }
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
