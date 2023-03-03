import { FiAlertCircle } from "react-icons/fi";

function InputErrorMessage({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return (
    <span role="alert" className={`text-sm text-red-500 ${className}`}>
      <FiAlertCircle className="mr-2" />
      {error}
    </span>
  );
}

export default InputErrorMessage;
