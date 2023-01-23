export const getEventCardDateDisplay = (date: Date) => {
  return Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  }).format(date);
};
