import Typography from "@ui/Typography";
import { atom, useAtom } from "jotai";
import { forwardRef, type ReactNode } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { MONTHS } from "../../utils/formUtils";

export const datePickerOpen = atom(false);

type CustomDatePickerProps = {
  value?: string;
  onClick?: () => void;
  label: string;
  star?: boolean;
};

const CustomDatePicker = forwardRef<HTMLButtonElement, CustomDatePickerProps>(
  ({ value, onClick, label, star }, ref) => (
    <div className="flex flex-col">
      <div className="relative">
        <button
          type="button"
          className="flex w-full items-center rounded-lg border border-neutral-200 bg-white p-3 text-left"
          onClick={onClick}
          ref={ref}
        >
          <FiCalendar className="mr-2" />
          {value || <span className="text-neutral-500">Select a date...</span>}
        </button>
        <span className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-8 rounded-lg bg-white px-2 text-xs text-black transition-all">
          {label}
          {star && <span className="ml-1 text-red-500">*</span>}
        </span>
      </div>
    </div>
  )
);
CustomDatePicker.displayName = "CustomDatePicker";
export default CustomDatePicker;

export function CalendarContainer({
  title,
  className,
  required,
  children,
}: {
  title: string;
  className?: string;
  required?: boolean;
  children: ReactNode;
  rest: any;
}) {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const element = e.target as HTMLButtonElement;
    const datepicker = element.closest(
      ".react-datepicker__tab-loop"
    ) as HTMLDivElement;
    datepicker.style.display = "none";
  };
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  return (
    <div
      className={`max-w-xs rounded-lg border-neutral-200 bg-white p-4 pb-3 ${className}`}
    >
      <header className="relative mb-4 pr-6 font-semibold">
        <Typography intent="h3">
          {title}
          {required && <span className="ml-1 text-error-400">*</span>}
        </Typography>
        {isDatePickerOpen && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-0 top-0"
          >
            <FiX
              className="text-neutral-200 transition-colors hover:text-brand-500"
              onClick={() => setIsDatePickerOpen(false)}
            />
          </button>
        )}
      </header>
      <div>{children}</div>
    </div>
  );
}

export function CalendarHeader({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}) {
  return (
    <div className="mb-2 flex w-full items-center justify-center">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="flex items-center"
      >
        <FiChevronLeft className="hover:text-brand-300 text-xl text-brand-500 transition-colors" />
      </button>
      <h5 className="mx-8 font-semibold">
        {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
      </h5>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="flex items-center"
      >
        <FiChevronRight className="hover:text-brand-300 text-xl text-brand-500 transition-colors" />
      </button>
    </div>
  );
}
