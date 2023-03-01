import { useQueryClient } from "@tanstack/react-query";
import Button from "@ui/Button";
import { notice } from "@ui/Snackbar";
import Typography from "@ui/Typography";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  disabled,
  selected,
  updated,
  type AvailabilityProps,
  type UserAvailability,
} from "../../utils/availabilityUtils";
import { trpc, type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import Form from "../form/Form";
import AvailabilityGrid from "./AvailabilityGrid";
import AvailabilityGridWriteApplyCheckbox from "./AvailabilityGridWriteApplyCheckbox";

type AnonAvailabilityInputs = {
  name: string;
};
const AnonAvailabilitySchema = z.object({ name: z.string().optional() });

const updateSchedule = (
  variables: {
    id: string;
    attendee: string;
  },
  newData: RouterOutputs["schedule"]["getScheduleFromSlugId"]
) => {
  const prevAttendees = newData?.attendees as UserAvailability[];
  const updatedAvailability = JSON.parse(
    variables.attendee
  ) as UserAvailability;
  const newAttendees = prevAttendees?.map((attendee) => {
    if (attendee.user === updatedAvailability.user) {
      return updatedAvailability;
    }
    return attendee;
  });

  return { ...newData, attendees: newAttendees };
};

function AvailabilityInput({ schedule }: AvailabilityProps) {
  const { data: sessionData } = useSession();
  const { startDate, endDate } = schedule;
  const attendees = schedule.attendees as UserAvailability[];
  const queryClient = useQueryClient();
  const setScheduleAvailability = trpc.schedule.setAvailability.useMutation({
    onSuccess: (data, variables) => {
      const { name, id } = data;
      queryClient.setQueryData(
        [
          ["schedule", "getScheduleFromSlugId"],
          {
            name,
            id: id.substring(id.length - 8),
          } as RouterInputs["schedule"]["getScheduleFromSlugId"],
        ],
        (prevData) => {
          const newData =
            prevData as RouterOutputs["schedule"]["getScheduleFromSlugId"];
          return updateSchedule(variables, newData);
        }
      );
    },
  });
  const [guestUser, setGuestUser] = useState<string>("");
  const [, setNoticeMessage] = useAtom(notice);
  const [selectedCells, setSelectedCells] = useAtom(selected);

  // might not need this copy, need to double check expected functionality
  // const [selectedCellsCopy, setSelectedCellsCopy] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useAtom(disabled);
  const [, setIsUpated] = useAtom(updated);

  const onSuccess = () => {
    if (!attendees) {
      return;
    }
    const userAvailability = attendees.filter(
      (attendee) => attendee.user === sessionData?.user?.id ?? guestUser
    )[0];
    const oldAvailability: string[] = [];
    const daysOnly: string[] = [];
    Object.entries(userAvailability?.availability ?? {}).forEach(
      ([date, hours]) => {
        const times = hours as string[];
        times.forEach((time) => {
          oldAvailability.push(`${date}:${time}`);
        });
        daysOnly.push(date);
      }
    );

    setSelectedCells([...oldAvailability]);
    // setSelectedCellsCopy([...oldAvailability]);
  };

  const userFullName = trpc.user.getUserFullName.useQuery(
    sessionData?.user?.id as string,
    {
      enabled: sessionData?.user !== undefined,
      refetchOnWindowFocus: false,
      onSuccess: () => onSuccess(),
    }
  );

  const save = async () => {
    const user = sessionData?.user?.id ?? (guestUser as string);
    const times = new Map<string, string[]>();
    const { data: userNames } = userFullName;
    const name = userNames
      ? `${userNames.firstName}${
          userNames.lastName ? ` ${userNames.lastName}` : ""
        }`
      : user;

    selectedCells.forEach((cell) => {
      const [date, time] = cell.split(":") as [string, string];
      const prevTimes = times.get(date);
      prevTimes
        ? times.set(date, [...prevTimes, time])
        : times.set(date, [time]);
    });
    const attendee = {
      user,
      name,
      availability: Object.fromEntries(times),
    };

    await setScheduleAvailability.mutateAsync(
      {
        id: schedule.id,
        attendee: JSON.stringify(attendee),
      },
      {
        onSuccess: () => {
          setIsUpated(true);
          setNoticeMessage({
            message: "Availability has been saved!",
            icon: "check",
          });
          setIsDisabled(true);
        },
      }
    );
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
          <Typography className="my-2">
            <span className="mr-2">Already have an account?</span>
            <span>
              <Link
                className="text-blue-500 transition-colors hover:text-blue-300"
                href="/login"
              >
                Log In
              </Link>
            </span>
          </Typography>
          <Typography className="py-2 text-center text-xl font-semibold">
            OR
          </Typography>
          <Form.Input type="text" name="name" displayName="Name" />
          <Form.Button type="submit" name="Continue" />
        </Form>
      )}
      {(guestUser || sessionData?.user) && (
        <>
          <AvailabilityGrid schedule={schedule} mode="write" />
          {selectedCells.length > 0 && (
            <AvailabilityGridWriteApplyCheckbox
              startDate={startDate}
              endDate={endDate}
            />
          )}
          <Button
            intent={isDisabled ? "primaryDisabled" : "primary"}
            type="button"
            onClick={() => save()}
            fullWidth
          >
            Save Response
          </Button>
        </>
      )}
    </section>
  );
}

export default AvailabilityInput;
