import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { parseDeepErrors } from "../../utils/formUtils";
import InputErrorMessage from "./InputErrorMessage";

type GenericOnSubmit = (
  data: Record<string, any>,
  event?: React.BaseSyntheticEvent
) => void;

export function Form<
  DataSchema extends Record<string, any>,
  Schema extends z.Schema<any, any>
>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className,
}: {
  schema: Schema;
  onSubmit: (data: DataSchema, event?: React.BaseSyntheticEvent) => void;
  children: any;
  defaultValues?: Record<string, any>;
  className?: string;
}) {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const handleSubmit = methods.handleSubmit;
  const reset = methods.reset;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

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
    <div className="flex flex-col gap-1">
      <fieldset className="relative">
        <input
          className="peer relative z-10 w-full rounded-lg border border-neutral-500 bg-inherit py-2 px-4 text-white placeholder:text-transparent"
          placeholder={displayName}
          type={type}
          {...register(name)}
          disabled={isSubmitting}
        />
        <label
          className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-neutral-900 px-2 text-xs text-white transition-all
              peer-placeholder-shown:left-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:z-0 peer-placeholder-shown:m-0 
              peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
              peer-focus:left-1 peer-focus:z-20 peer-focus:-translate-y-[1.85rem] peer-focus:text-xs peer-focus:text-white"
          htmlFor={name}
        >
          {displayName}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </fieldset>

      {error && <InputErrorMessage error={error as string} />}
    </div>
  );
};

Form.Select = function Select({
  name,
  displayName,
  options,
  required,
  className,
}: {
  name: string;
  displayName: string;
  options: any[];
  required?: boolean;
  className?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = parseDeepErrors(errors, name);
  // console.log(error);
  return (
    <div className="flex w-full flex-col gap-1">
      <fieldset className="relative">
        <select
          key={name}
          {...register(name, { valueAsNumber: typeof options[0] === "number" })}
          className={`peer relative z-10 w-full rounded-lg border border-neutral-500 bg-transparent py-2 px-4 text-white placeholder:text-transparent ${
            className || ""
          }`}
          placeholder={displayName}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label
          className="absolute left-1 top-1/2 z-20 ml-2 flex -translate-y-[1.85rem] rounded-lg bg-neutral-900 px-2 text-xs text-white transition-all
        peer-placeholder-shown:left-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:z-0 peer-placeholder-shown:m-0 
        peer-placeholder-shown:ml-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
        peer-focus:left-1 peer-focus:z-20 peer-focus:-translate-y-[1.85rem] peer-focus:text-xs peer-focus:text-white"
          htmlFor={name}
        >
          {displayName}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </fieldset>
      {error && <InputErrorMessage error={error as string} />}
    </div>
  );
};

Form.Button = function Button({
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
    <button
      type={type}
      className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-black transition-colors hover:bg-blue-300"
    >
      {name}
      {isSubmitting && (
        <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
      )}
    </button>
  );
};
