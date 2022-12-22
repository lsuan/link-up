import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  FieldError,
  FieldErrorsImpl,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";

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

Form.Input = function Input<Model extends Record<string, any>>({
  name,
  displayName,
  type,
}: {
  name: string;
  displayName: string;
  type: string;
}) {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const parseDeepErrors = (
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

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{displayName}</label>
      <input type={type} {...register(name)} disabled={isSubmitting} />
      {parseDeepErrors(errors, name) && (
        <span role="alert" className="text-sm text-red-500">
          <FontAwesomeIcon className="mr-1" icon={faCircleExclamation} />
          {parseDeepErrors(errors, name) as string}
        </span>
      )}
    </div>
  );
};

Form.Submit = function Submit({
  name,
  type,
}: {
  name: string;
  type: "button" | "reset" | "submit" | undefined;
}) {
  return (
    <button type={type} className="mt-4">
      {name}
    </button>
  );
};
