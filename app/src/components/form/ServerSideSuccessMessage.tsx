import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ServerSideSuccessMessage({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-center rounded-lg bg-green-100 px-4 py-2 text-green-700">
      <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
      {message}
    </div>
  );
}

export default ServerSideSuccessMessage;
