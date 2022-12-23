import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ServerSideErrorMessage({ error }: { error: string }) {
  return (
    <div className="mb-6 flex items-center rounded-lg bg-red-200 px-4 py-2 text-red-500">
      <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
      {error}
    </div>
  );
}

export default ServerSideErrorMessage;
