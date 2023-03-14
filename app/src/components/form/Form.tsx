import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Tooltip from "@ui/Tooltip";
import Typography from "@ui/Typography";
import { useEffect, useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type DeepPartial,
  type FieldValues,
} from "react-hook-form";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { type z } from "zod";
import {
  parseDeepErrors,
  PASSWORD_REGEX_CONDITIONS,
  type PasswordCondition,
} from "../../utils/formUtils";
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

/** Use this component for short text-based input fields. */
Form.Input = function Input({
  name,
  displayName,
  type,
  required,
}: {
  name: string;
  displayName: string;
  type: string;
  required?: boolean;
}) {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);

  return (
    <>
      {type !== "hidden" && (
        <div className="flex flex-col gap-1">
          {type !== "hidden" && (
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
                  className="peer relative z-10 w-full rounded-lg border border-neutral-500 bg-inherit py-2 px-4 text-black placeholder:text-transparent"
                  placeholder={displayName}
                  type={type}
                  {...register(name)}
                  disabled={isSubmitting}
                  aria-invalid={error ? "true" : "false"}
                />
              )}

              <label
                className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-white px-2 text-xs text-black transition-all
              peer-placeholder-shown:left-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:z-0 peer-placeholder-shown:m-0
              peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
              peer-focus:left-1 peer-focus:z-20 peer-focus:-translate-y-[1.85rem] peer-focus:text-xs peer-focus:text-black"
                htmlFor={name}
              >
                {displayName}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            </fieldset>
          )}
        </div>
      )}
      {error && <InputErrorMessage error={error as string} className="-mt-3" />}
    </>
  );
};

/** Use this component for longer text-based input fields. */
Form.TextArea = function Input({
  name,
  displayName,
  maxLength,
  required,
}: {
  name: string;
  displayName: string;
  maxLength: number;
  required?: boolean;
}) {
  const text = useWatch({ name });
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);

  return (
    <>
      <div className="flex flex-col gap-1">
        <fieldset className="relative">
          <textarea
            className="peer relative z-10 w-full rounded-lg border border-neutral-500 bg-inherit py-2 px-4 text-black placeholder:text-transparent"
            placeholder={displayName}
            {...register(name)}
            maxLength={maxLength}
            disabled={isSubmitting}
            aria-invalid={error ? "true" : "false"}
          />
          <label
            className="absolute left-1 top-[1.35rem] z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-white px-2 text-xs text-black transition-all
          peer-placeholder-shown:left-0 peer-placeholder-shown:top-[1.35rem] peer-placeholder-shown:z-0 peer-placeholder-shown:m-0
          peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
          peer-focus:left-1 peer-focus:z-20 peer-focus:-translate-y-[1.85rem] peer-focus:text-xs peer-focus:text-black"
            htmlFor={name}
          >
            {displayName}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {text?.length >= maxLength ? (
            <span className="absolute right-1 -bottom-3 text-xs text-red-600">
              {`${text?.length || 0}/${maxLength}`}
            </span>
          ) : (
            <span className="absolute right-1 -bottom-3 text-xs">
              {`${text?.length || 0}/${maxLength}`}
            </span>
          )}
        </fieldset>
      </div>
      {error && <InputErrorMessage error={error as string} className="-mt-3" />}
    </>
  );
};

/**
 * A special password input field that displays the conditions on top of the input.
 * For "Confirm Password" fields, use the Form.Input component.
 */
Form.Password = function Input({
  name,
  required,
}: {
  name: string;
  required: boolean;
}) {
  // const {
  //   formState: { errors },
  // } = useFormContext();

  const password = useWatch({ name });
  const [conditions, setConditions] = useState<PasswordCondition[]>([
    ...PASSWORD_REGEX_CONDITIONS,
  ]);
  // const error = parseDeepErrors(errors, name);

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
      <ul className="rounded-lg bg-neutral-300 p-4 text-sm">
        {conditions.map((condition) => (
          <li
            key={condition.message}
            className={`flex items-center gap-2${
              condition.isFulFilled ? " text-green-300" : " text-black"
            }`}
          >
            {condition.isFulFilled ? <FiCheckCircle /> : <FiAlertCircle />}
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

Form.Select = function Select({
  name,
  displayName,
  options,
  required,
  className,
  tooltipText,
}: {
  name: string;
  displayName: string;
  options: string[] | number[];
  required?: boolean;
  className?: string;
  tooltipText?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);
  return (
    <div className="flex w-full flex-col gap-1">
      <fieldset className="relative flex items-center gap-1">
        <select
          key={name}
          {...register(name, { valueAsNumber: typeof options[0] === "number" })}
          className={`peer relative z-10 w-full rounded-lg border border-neutral-500 bg-transparent py-2 px-4 text-black placeholder:text-transparent ${
            className || ""
          }`}
          placeholder={displayName}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label
          className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-white px-2 text-xs text-black transition-all
        peer-placeholder-shown:left-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:z-0 peer-placeholder-shown:m-0
        peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
        peer-focus:left-1 peer-focus:z-20 peer-focus:-translate-y-[1.85rem] peer-focus:text-xs peer-focus:text-black"
          htmlFor={name}
        >
          {displayName}
          {required && <span className="ml-1 text-red-500">*</span>}
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

Form.Button = function FormButton({
  name,
  type,
}: {
  name: string;
  type: "button" | "reset" | "submit" | undefined;
}) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button type={type} isLoading={isSubmitting}>
      {name}
    </Button>
  );
};

// TODO: add keyboard enter functionality for accessibility
Form.Checkbox = function Input({
  name,
  label,
  onClick,
  className,
  tooltipText,
}: {
  name: string;
  label: string;
  onClick?: () => void;
  className?: string;
  tooltipText?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = parseDeepErrors(errors, name);

  return (
    <div className={`flex flex-col gap-1${className ? ` ${className}` : ""}`}>
      <fieldset className="flex items-center gap-2">
        <input type="checkbox" {...register(name)} onClick={onClick} />
        <label htmlFor={name}>{label}</label>
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
