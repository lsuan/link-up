import {
  faClose,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { atom, useAtom, useAtomValue } from "jotai";
import { MONTHS } from "../../utils/formHelpers";

export const datePickerOpen = atom(false);

export const CalendarContainer = ({
  title,
  className,
  required,
  children,
}: {
  title: string;
  className?: string;
  required?: boolean;
  children: any;
}) => {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const element = e.target as HTMLButtonElement;
    const datepicker = element.closest(
      ".react-datepicker__tab-loop"
    ) as HTMLDivElement;
    datepicker.style.display = "none";
  };
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(datePickerOpen);
  return (
    <>
      <div
        className={`max-w-xs rounded-lg bg-neutral-700 p-4 pb-3 ${className}`}
      >
        <header className="relative mb-4 font-semibold">
          <h3>
            {title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </h3>
          {isDatePickerOpen && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-0 top-0"
            >
              <FontAwesomeIcon
                icon={faClose}
                className="text-neutral-500 transition-colors hover:text-neutral-300"
                onClick={() => setIsDatePickerOpen(false)}
              />
            </button>
          )}
        </header>
        <div>{children}</div>
      </div>
    </>
  );
};

export const CalendarHeader = ({
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
}) => (
  <div className="mb-2 flex w-full items-center justify-center">
    <button
      type="button"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className="flex items-center"
    >
      <FontAwesomeIcon
        icon={faAngleLeft}
        className="text-xl text-blue-500 transition-colors hover:text-blue-300"
      />
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
      <FontAwesomeIcon
        icon={faAngleRight}
        className="text-xl text-blue-500 transition-colors hover:text-blue-300"
      />
    </button>
  </div>
);
