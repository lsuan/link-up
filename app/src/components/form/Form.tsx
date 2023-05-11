import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Tooltip from "@ui/Tooltip";
import Typography from "@ui/Typography";
import { cva } from "cva";
import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type DeepPartial,
  type FieldValues,
} from "react-hook-form";
import { FiAlertCircle, FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { type z } from "zod";
import {
  PASSWORD_REGEX_CONDITIONS,
  parseDeepErrors,
  type PasswordCondition,
} from "../../utils/formUtils";
import { USER_TIMEZONE, getUtcOffsetName } from "../../utils/timeUtils";
import InputErrorMessage from "./InputErrorMessage";
import ShowPassword from "./ShowPassword";

type GenericOnSubmit = (
  data: Record<string, unknown>,
  event?: React.BaseSyntheticEvent
) => void;

/**
 * Generic form component that abstracts the implementation of React-Hook-Form.
 * It allows for custom reusable child components.
 */
export default function Form<
  DataSchema extends Record<string, unknown>,
  Schema extends z.Schema<unknown>
>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className,
}: {
  schema: Schema;
  onSubmit: (data: DataSchema, event?: React.BaseSyntheticEvent) => void;
  children: ReactNode;
  defaultValues?: DeepPartial<FieldValues>;
  watchFields?: string[];
  className?: string;
}) {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={handleSubmit(onSubmit as GenericOnSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  displayName: string;
}

const floatinglabelStyles = cva(
  `absolute left-1 top-1/2 z-20 ml-2 flex rounded-lg bg-white px-2 text-xs text-black transition-all
peer-placeholder-shown:left-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:z-0 peer-placeholder-shown:m-0
peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-200
peer-focus:left-1 peer-focus:z-20 peer-focus:text-xs peer-focus:text-black`,
  {
    variants: {
      isTextArea: {
        true: "-translate-y-11 peer-focus:-translate-y-11",
        false: "-translate-y-8 peer-focus:-translate-y-8",
      },
    },
  }
);

const inputStyles = cva(
  "peer relative z-10 w-full rounded-lg border border-neutral-200 bg-inherit p-3 text-black placeholder:text-transparent",
  {
    variants: {
      error: {
        true: "border-error-400",
      },
    },
  }
);

/** Use this component for short text-based input fields. */
Form.Input = function Input({
  name,
  displayName,
  type,
  required,
  className,
}: InputProps) {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);

  return (
    <>
      {type !== "hidden" && (
        <div className="flex flex-col gap-1">
          <fieldset className="relative">
            {type === "password" ? (
              <ShowPassword
                name={name}
                displayName={displayName}
                isSubmitting={isSubmitting}
                error={error}
                register={register}
              />
            ) : (
              <input
                className={inputStyles({ error: !!error, className })}
                placeholder={displayName}
                type={type}
                {...register(name)}
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
              />
            )}

            <label
              className={floatinglabelStyles({ isTextArea: false })}
              htmlFor={name}
            >
              {displayName}
              {required && <span className="ml-1 text-error-500">*</span>}
            </label>
          </fieldset>
          {error && <InputErrorMessage error={error as string} />}
        </div>
      )}
      {type === "hidden" && error && (
        <InputErrorMessage error={error as string} className="-mt-3" />
      )}
    </>
  );
};

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  displayName: string;
  maxLength: number;
}

/** Use this component for longer text-based input fields. */
Form.TextArea = function Input({
  name,
  displayName,
  maxLength,
  required,
}: TextAreaProps) {
  const text = useWatch({ name });
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);

  return (
    <>
      <div className="flex flex-col gap-1">
        {/* this needs to be flexed to fix the floating label height */}
        <fieldset className="relative flex h-fit">
          <textarea
            className="peer relative z-10 w-full rounded-lg border border-neutral-200 bg-inherit p-3 text-black placeholder:text-transparent"
            placeholder={displayName}
            {...register(name)}
            maxLength={maxLength}
            disabled={isSubmitting}
            aria-invalid={error ? "true" : "false"}
          />
          <label
            className={floatinglabelStyles({ isTextArea: true })}
            htmlFor={name}
          >
            {displayName}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
          <span
            className={`absolute right-1 -bottom-4 text-xs${
              text?.length > maxLength ? " text-error-400" : " text-neutral-200"
            }`}
          >
            {`${text?.length || 0}/${maxLength}`}
          </span>
        </fieldset>
      </div>
      {error && <InputErrorMessage error={error as string} className="-mt-3" />}
    </>
  );
};

interface PasswordProps {
  name: string;
  required: boolean;
}

/**
 * A special password input field that displays the conditions on top of the input.
 * For "Confirm Password" fields, use the Form.Input component.
 */
Form.Password = function Input({ name, required }: PasswordProps) {
  const password = useWatch({ name });
  const [conditions, setConditions] = useState<PasswordCondition[]>([
    ...PASSWORD_REGEX_CONDITIONS,
  ]);

  useEffect(() => {
    const currentConditions = conditions.map((condition) => {
      if (password?.match(condition.regex)) {
        return { ...condition, isFulFilled: true };
      }
      return { ...condition, isFulFilled: false };
    });
    setConditions(currentConditions);
  }, [conditions, password]);

  return (
    <>
      <ul className="rounded-lg bg-brand-100 p-4 text-sm">
        <Typography>Password should have: </Typography>
        {conditions.map((condition) => (
          <li
            key={condition.message}
            className={`flex items-center pl-4 gap-2${
              condition.isFulFilled ? " text-green-300" : " text-black"
            }`}
          >
            <span className="text-brand-500">
              {condition.isFulFilled ? <FiCheck /> : <FiX />}
            </span>
            <Typography>{condition.message}</Typography>
          </li>
        ))}
      </ul>

      <Form.Input
        name={name}
        displayName="Password"
        type="password"
        required={required}
      />
    </>
  );
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  displayName: string;
  options: string[] | number[];
  tooltipText?: string;
  values?: string[] | number[];
}

Form.Select = function Select({
  name,
  displayName,
  options,
  required,
  className,
  tooltipText,
  values,
}: SelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  if (values && options.length !== values?.length) {
    throw new Error("Options and Values attributes must be of the same length");
  }

  const error = parseDeepErrors(errors, name);

  return (
    <div className="flex w-full flex-col gap-1">
      <fieldset className="relative flex items-center gap-1">
        <select
          key={name}
          {...register(name, {
            valueAsNumber: values
              ? typeof values[0] === "number"
              : typeof options[0] === "number",
          })}
          className={`peer relative z-10 w-full appearance-none rounded-lg border border-neutral-200 bg-transparent p-3 text-black placeholder:text-transparent ${
            className || ""
          }`}
          placeholder={displayName}
        >
          {options.map((option, index) => (
            <option key={option} value={values ? values[index] : option}>
              {option}
            </option>
          ))}
        </select>
        <span className="absolute right-8">
          <FiChevronDown />
        </span>
        <label
          className={floatinglabelStyles({ isTextArea: false })}
          htmlFor={name}
        >
          {displayName}
          {required && <span className="ml-1 text-error-500">*</span>}
        </label>
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <FiAlertCircle />
          </Tooltip>
        )}
      </fieldset>
      {error && <InputErrorMessage error={error as string} />}
    </div>
  );
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

Form.Button = function FormButton({ name, type }: ButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button type={type} isLoading={isSubmitting}>
      {name}
    </Button>
  );
};

interface SearchableSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  displayName: string;
  options: string[];
  tooltipText?: string;
}

const optionStyles = cva(
  "p-2 rounded-lg hover:bg-brand-100 cursor-pointer transition-colors",
  {
    variants: {
      intent: {},
      isSelected: { true: "bg-brand-200" },
    },
  }
);

/**
 * A custom searchable select component that includes a search box in the options container.
 * Used for extremely long lists of options.
 * Right now, it's used for the timezone selection,
 * but it can be refactored to be more generic.
 */
Form.SearchableSelect = function SearchableSelect({
  name,
  displayName,
  options,
  tooltipText,
}: SearchableSelectProps) {
  const {
    formState: { errors },
    getValues,
    reset,
  } = useFormContext();
  const error = parseDeepErrors(errors, name);
  const watch = useWatch({ name: "searchTerm" });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(getValues(name));

  const handleSelect = (option: string) => {
    setIsMenuOpen(false);
    setSelected(option);
    reset({ [name]: option });
  };

  const filteredOptions = useMemo(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(watch)
    );
    return filtered;
  }, [options, watch]);

  // allows the user exit out of the component by pressing the escape key
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    });
    // this scrolls the current selected option into view
    const currentOption = document.querySelector(`option[value='${selected}']`);
    currentOption?.scrollIntoView({ behavior: "auto" });
  }, [isMenuOpen]);

  /**
   * Creates keyboard accessibility for the component.
   * It automatically scrolls to the current selected option.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const element = e.target as HTMLDivElement;
    const currentOptions =
      filteredOptions.length === 0 ? options : filteredOptions;

    switch (e.key) {
      case "Enter":
        if (selected) {
          handleSelect(selected);
        }
        break;
      case "ArrowDown": {
        let currentIndex = currentOptions.findIndex(
          (option) => option === selected
        );
        if (currentIndex < currentOptions.length - 1) {
          currentIndex += 1;
        }
        if (currentIndex === currentOptions.length - 1) {
          currentIndex = 0;
        }
        const currentSelected = currentOptions[currentIndex];
        element.children[currentIndex]?.scrollIntoView({
          behavior: "auto",
        });
        setSelected(currentSelected!);
        break;
      }
      case "ArrowUp": {
        let currentIndex = currentOptions.findIndex(
          (option) => option === selected
        );
        if (currentIndex > 0) {
          currentIndex -= 1;
        }
        if (currentIndex === 0) {
          currentIndex = currentOptions.length - 1;
        }
        const currentSelected = currentOptions[currentIndex];
        element.children[currentIndex]?.scrollIntoView({
          behavior: "auto",
        });
        setSelected(currentSelected!);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <fieldset className="relative flex w-full items-center gap-1">
        <Button
          type="button"
          className="justify-between border border-neutral-200 bg-white p-3 text-left text-base font-normal text-black hover:bg-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          fullWidth
        >
          {selected}
          <span>
            <FiChevronDown />
          </span>
        </Button>

        {isMenuOpen && (
          <section
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="absolute bottom-16 z-30 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-2 pt-8"
          >
            <Form.Input
              name="searchTerm"
              displayName="Search Timezone"
              type="text"
            />
            <div
              className="max-h-[10rem] overflow-auto"
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
            >
              {filteredOptions.length === 0 &&
                options.map((option) => (
                  <option
                    key={option}
                    value={option}
                    label={option}
                    className={optionStyles({
                      isSelected: option === selected,
                    })}
                    onClick={() => handleSelect(option)}
                  />
                ))}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option) => (
                  <option
                    key={option}
                    label={option}
                    value={option}
                    className={optionStyles({
                      isSelected: option === selected,
                    })}
                    onClick={() => handleSelect(option)}
                  />
                ))}
            </div>
            <FiX
              className="absolute right-2 top-2 cursor-pointer text-neutral-200 hover:text-brand-500"
              onClick={() => setIsMenuOpen(false)}
            />
          </section>
        )}

        <label
          className={floatinglabelStyles({ isTextArea: false })}
          htmlFor={name}
        >
          {displayName}
        </label>
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <FiAlertCircle />
          </Tooltip>
        )}
      </fieldset>
      {error && <InputErrorMessage error={error as string} />}
    </div>
  );
};

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  tooltipText?: string;
}

// TODO: add keyboard enter functionality for accessibility
Form.Checkbox = function Input({
  name,
  label,
  onClick,
  className,
  tooltipText,
}: CheckboxProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = parseDeepErrors(errors, name);

  // used only to style the checkbox
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div className={`flex flex-col gap-1${className ? ` ${className}` : ""}`}>
      <fieldset className="relative flex items-center gap-2">
        <input
          className="peer relative z-20 appearance-none rounded border border-neutral-200 bg-transparent p-2 transition-all checked:border-brand-500"
          type="checkbox"
          {...register(name)}
          onClick={() => {
            setIsChecked(!isChecked);
            onClick;
          }}
        />
        <label htmlFor={name}>
          <FiCheck
            className={`absolute top-1/2 left-[1px] -translate-y-1/2 bg-brand-500  ${
              isChecked ? "block text-white" : "hidden"
            }`}
          />
          {label}
        </label>
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <FiAlertCircle />
          </Tooltip>
        )}
      </fieldset>
      {error && <InputErrorMessage error={error as string} className="-mt-1" />}
    </div>
  );
};
