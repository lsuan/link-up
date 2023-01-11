import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { notice } from "../../pages/schedule/[slug]";
import { UserAvailability } from "../../utils/availabilityTableUtils";
import { trpc } from "../../utils/trpc";
import { Form } from "../form/Form";
import AvailabilityGrid from "./AvailabilityGrid";
import { AvailabilityProps } from "./AvailabilitySection";

type AnonAvailabilityInputs = {
  name: string;
};

const AnonAvailabilitySchema = z.object({ name: z.string().optional() });

export const selected = atom<string[]>([]);
export const disabled = atom<boolean>(false);

// FIXME: removing selected cell on edit isn't working correcty
function AvailabilityInput({ scheduleQuery, schedule }: AvailabilityProps) {
  const { status, data: sessionData } = useSession();
  const { id } = schedule;
  const setScheduleAvailability = trpc.schedule.setAvailability.useMutation();
  const [guestUser, setGuestUser] = useState<string>("");
  const [, setNoticeMessage] = useAtom(notice);
  const [selectedCells, setSelectedCells] = useAtom(selected);
  const [isDisabled, setIsDisabled] = useAtom(disabled);
  const userFullName = trpc.user.getUserFullName.useQuery(
    sessionData?.user?.id as string,
    { enabled: sessionData?.user !== undefined, refetchOnWindowFocus: false }
  );
  const userAvailability = trpc.schedule.getUserAvailability.useQuery(
    {
      id,
      user: sessionData?.user?.id ?? guestUser,
    },
    {
      enabled:
        (status === "authenticated" && sessionData.user !== undefined) ||
        (status === "unauthenticated" && guestUser !== ""),
      refetchOnWindowFocus: false,
      onSuccess: (data) => onSuccess(data),
    }
  );

  const onSuccess = (data: UserAvailability[]) => {
    const userAvailability = data[0];
    const oldAvailability: string[] = [];
    for (const [date, hours] of Object.entries(
      userAvailability?.availability ?? {}
    )) {
      const times = hours as string[];
      times.forEach((time) => {
        oldAvailability.push(`${date}:${time}`);
      });
    }
    setSelectedCells([...oldAvailability]);
  };

  const save = async () => {
    const user = sessionData?.user?.id ?? (guestUser as string);
    const times = new Map<string, string[]>();
    const name = userFullName
      ? {
          firstName: userFullName.data?.firstName,
          lastName: userFullName.data?.lastName,
        }
      : user;

    selectedCells.forEach((cell) => {
      const [date, time] = cell.split(":") as [string, string];
      const prevTimes = times.get(date);
      prevTimes
        ? times.set(date, [...prevTimes, time])
        : times.set(date, [time]);
    });
    const attendee = {
      user: user,
      name: name,
      availability: Object.fromEntries(times),
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

  const handleGuestUserSubmit: SubmitHandler<AnonAvailabilityInputs> = (
    data
  ) => {
    setGuestUser(data.name);
  };

  return (
    <section>
      {!sessionData?.user && !guestUser && (
        <Form<AnonAvailabilityInputs, typeof AnonAvailabilitySchema>
          schema={AnonAvailabilitySchema}
          onSubmit={handleGuestUserSubmit}
          className="mb-8 flex flex-col gap-2"
        >
          <p className="my-2">
            <span className="mr-2">Already have an account?</span>
            <span>
              <Link
                className="text-blue-500 transition-colors hover:text-blue-300"
                href="/login"
              >
                Log In
              </Link>
            </span>
          </p>
          <p className="py-2 text-center text-xl font-semibold">OR</p>
          <Form.Input type="text" name="name" displayName="Name" />
          <Form.Button type="submit" name="Continue" />
        </Form>
      )}
      {(guestUser || sessionData?.user) && (
        <>
          <AvailabilityGrid
            schedule={schedule}
            scheduleQuery={scheduleQuery}
            mode="write"
          />
          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-neutral-500 p-2 text-center transition-all hover:bg-neutral-300 hover:text-black disabled:cursor-default disabled:bg-neutral-700 disabled:text-neutral-300"
            onClick={() => save()}
            disabled={isDisabled}
          >
            Save Response
          </button>
        </>
      )}
    </section>
  );
}

export default AvailabilityInput;
