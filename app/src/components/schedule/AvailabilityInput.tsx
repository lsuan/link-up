import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { notice } from "../../pages/schedule/[slug]";
import { createTable } from "../../utils/availabilityTableUtils";
import { trpc } from "../../utils/trpc";
import { AvailabilityProps } from "./AvailabilitySection";

function AvailabilityInput({ scheduleQuery, schedule }: AvailabilityProps) {
  const { data: sessionData } = useSession();
  const { startDate, endDate, startTime, endTime } = schedule;
  const [isTableReady, setIsTableReady] = useState<boolean>(false);
  const setScheduleAvailability = trpc.schedule.setAvailability.useMutation();
  const [availability, setAvailability] = useState(new Map<string, string[]>());
  const [guestUser, setGuestUser] = useState<string>();
  const [, setNoticeMessage] = useAtom(notice);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    createTable(startDate, endDate, startTime, endTime, "availability-input");
    setIsTableReady(true);
  }, []);

  useEffect(() => {
    const setCellBackground = (
      cellElement: HTMLDivElement,
      currentAvailability: Map<string, Set<string>>
    ) => {
      const date = cellElement.parentElement?.getAttribute(
        "data-date"
      ) as string;
      const hour = cellElement.getAttribute("data-time") as string;
      if (cellElement.classList.contains("bg-indigo-500")) {
        cellElement.classList.remove("bg-indigo-500");
        const currentTimes = currentAvailability.get(date);
        currentTimes?.delete(hour);
        if (currentTimes?.size === 0) {
          currentAvailability.delete(date);
        }
      } else {
        cellElement.classList.add("bg-indigo-500");
        const responses = currentAvailability.get(date);
        currentAvailability.set(
          date,
          responses ? new Set([...responses, hour]) : new Set([hour])
        );
      }
    };
    if (!isTableReady) {
      return;
    }

    let isEditing = false;
    let currentAvailability = new Map<string, Set<string>>();
    let startCell: null | HTMLDivElement;
    document
      .querySelectorAll("#availability-input .time-cell")
      .forEach((cell) => {
        cell.addEventListener("mousedown", (e) => {
          e.preventDefault();
          isEditing = true;
          const cellElement = e.target as HTMLDivElement;
          setCellBackground(cellElement, currentAvailability);
          startCell = cellElement;
          setIsDisabled(false);
        });

        // TODO: revisit to implement square fill in functionality
        cell.addEventListener("mouseover", (e) => {
          e.preventDefault();
          if (!isEditing || !startCell) {
            return;
          }
          const cellElement = e.target as HTMLDivElement;
          setCellBackground(cellElement, currentAvailability);
          const startRow = parseInt(
            startCell.getAttribute("data-row-index") || ""
          );
          const startCol = parseInt(
            startCell.getAttribute("data-col-index") || ""
          );
          const endRow = parseInt(
            startCell.getAttribute("data-row-index") || ""
          );
          const endCol = parseInt(
            startCell.getAttribute("data-col-index") || ""
          );

          // FIXME: fix the implementation for setting neighboring cells
          for (let i = startRow; i <= endRow; i++) {
            const passedCell = document.querySelector(
              `.time-cell[data-row-index='${i}'][data-col-index='${endCol}']`
            ) as HTMLDivElement;
            setCellBackground(passedCell, currentAvailability);
          }

          for (let i = startCol; i <= endCol; i++) {
            const passedCell = document.querySelector(
              `.time-cell[data-row-index='${endRow}'][data-col-index='${i}']`
            ) as HTMLDivElement;
            setCellBackground(passedCell, currentAvailability);
          }
        });

        cell.addEventListener("mouseup", (e) => {
          e.preventDefault();
          isEditing = false;
          const newMap = new Map<string, string[]>();
          for (const [key, values] of currentAvailability) {
            newMap.set(key, [...values]);
          }
          setAvailability(newMap);
        });
      });
  }, [isTableReady]);

  const save = async () => {
    const user = sessionData?.user?.id || (guestUser as string);
    const times = Object.fromEntries(availability);
    const attendee = {
      user: user,
      availability: times,
    };

    const res = await setScheduleAvailability.mutateAsync({
      id: schedule.id,
      attendee: JSON.stringify(attendee),
    });
    if (res) {
      setNoticeMessage("Availability has been saved!");
      setIsDisabled(true);
      scheduleQuery.refetch();
    }
  };

  // TODO: add an input for non-logged-in users
  return (
    <section>
      <div className="horizontal-scrollbar relative mt-4 mb-6 grid place-items-center overflow-x-scroll pb-4">
        <div
          className="border-grey-500 flex w-fit pl-1"
          id="availability-input"
        ></div>
      </div>
      <button
        type="button"
        onClick={() => save()}
        disabled={isDisabled}
        className="mx-auto w-full rounded-lg bg-neutral-500 px-4 py-2 transition-colors hover:bg-neutral-300 hover:text-black disabled:bg-neutral-700 disabled:text-neutral-500"
      >
        Save Availability
      </button>
    </section>
  );
}

export default AvailabilityInput;
