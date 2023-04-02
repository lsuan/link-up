import Typography from "@ui/Typography";
import { cva } from "cva";
import { FiAlertCircle } from "react-icons/fi";

interface InputErrorMessageProps {
  error: string;
  className?: string;
}

const inputErrorMessageStyles = cva(
  "inline-flex items-center gap-1 text-xs text-error-500"
);

function InputErrorMessage({ error, className }: InputErrorMessageProps) {
  return (
    <div className={inputErrorMessageStyles({ className })}>
      <span>
        <FiAlertCircle />
      </span>
      <Typography role="alert" className="text-inherit">
        {error}
      </Typography>
    </div>
  );
}

export default InputErrorMessage;
