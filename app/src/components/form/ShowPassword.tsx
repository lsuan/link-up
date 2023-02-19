import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from "react-hook-form";

function ShowPassword({
  name,
  displayName,
  isSubmitting,
  error,
  register,
}: {
  name: string;
  displayName: string;
  isSubmitting: boolean;
  error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined;
  register: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
}) {
  const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <>
      <input
        className="peer relative z-10 w-full rounded-lg border border-neutral-500 bg-inherit py-2 px-4 text-white placeholder:text-transparent"
        placeholder={displayName}
        type={isShown ? "text" : "password"}
        {...register(name)}
        disabled={isSubmitting}
        aria-invalid={error ? "true" : "false"}
      />
      <button
        type="button"
        onClick={() => setIsShown(!isShown)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2"
      >
        {isShown ? (
          <FontAwesomeIcon icon={faEyeSlash} />
        ) : (
          <FontAwesomeIcon icon={faEye} />
        )}
      </button>
    </>
  );
}

export default ShowPassword;
