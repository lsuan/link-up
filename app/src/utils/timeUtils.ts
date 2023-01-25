export const getEventCardDateDisplay = (date: Date) => {
  return Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  }).format(date);
};

export const getShortenedDateWithDay = (date: Date) => {
  return Intl.DateTimeFormat("en-us", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};
