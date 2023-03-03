import { FiAlertCircle } from "react-icons/fi";

function ServerSideSuccessMessage({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-center rounded-lg bg-green-100 px-4 py-2 text-green-700">
      <FiAlertCircle className="mr-2" />
      {message}
    </div>
  );
}

export default ServerSideSuccessMessage;
