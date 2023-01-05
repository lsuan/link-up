import { faListCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import AvailabilityTable from "../../components/schedule/AvailbilityTable";
import EditEventCard from "../../components/schedule/publish/EditEventCard";
import PublishEventCard from "../../components/schedule/publish/PublishEventCard";
import BackArrow from "../../components/shared/BackArrow";
import { notice } from "./schedule";

const events = [];
function Publish() {
  const [, setNoticeMessage] = useAtom(notice);
  const [isEditing, setIsEditing] = useState<boolean[]>([false]);
  const router = useRouter();

  const handlePublish = () => {
    setNoticeMessage("Your events have been successfully published!");
    router.push("/schedule/schedule");
  };

  return (
    <section className="px-8">
      <BackArrow href="/schedule/schedule" page="Schedule" />
      <h1 className="mb-12 text-3xl font-semibold">Publish Event(s)</h1>
      <AvailabilityTable />
      <h3 className="my-4 font-semibold">
        These are the best times based on your preferences (2 events, 2 hours
        each):
      </h3>
      <div className="my-4 flex flex-col items-center gap-2">
        {isEditing[0] ? (
          <EditEventCard
            index={0}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ) : (
          <PublishEventCard
            index={0}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        <button className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-300 hover:text-blue-700">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <button
        className="mt-12 w-full rounded-lg bg-neutral-500 p-2 hover:bg-neutral-300 hover:text-black"
        onClick={() => handlePublish()}
      >
        <FontAwesomeIcon icon={faListCheck} className="mr-2" />
        Confirm and Publish
      </button>
    </section>
  );
}

export default Publish;
