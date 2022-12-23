import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputErrorMessage({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return (
    <span role="alert" className={`text-sm text-red-500 ${className}`}>
      <FontAwesomeIcon className="mr-1" icon={faCircleExclamation} />
      {error}
    </span>
  );
}

export default InputErrorMessage;
