import { FiAlertCircle } from "react-icons/fi";

function ServerSideErrorMessage({ error }: { error: string }) {
  return (
    <div className="mb-6 flex items-center rounded-lg bg-red-100 px-4 py-2 text-red-700">
      <FiAlertCircle className="mr-3" />
      {error}
    </div>
  );
}

export default ServerSideErrorMessage;
