import { FiAlertCircle } from "react-icons/fi";

interface ServerSideErrorMessageProps {
  error: string;
}

function ServerSideErrorMessage({ error }: ServerSideErrorMessageProps) {
  return (
    <div className="flex items-center rounded-lg bg-red-100 px-4 py-2 text-red-700">
      <span>
        <FiAlertCircle className="mr-3" />
      </span>
      {error}
    </div>
  );
}

export default ServerSideErrorMessage;
