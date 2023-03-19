import Typography from "@ui/Typography";
import { FiAlertCircle } from "react-icons/fi";

function InputErrorMessage({ error }: { error: string; className?: string }) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-error-500">
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
