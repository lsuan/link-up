import { type User } from "@prisma/client";
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
  updated,
  type AvailabilityProps,
  type CalendarDays,
} from "../../utils/availabilityUtils";
import type CREATE_AVAILABILITY_API_SCHEMA from "../../utils/schemas/createAvailability";
import { trpc, type RouterInputs, type RouterOutputs } from "../../utils/trpc";
import Form from "../form/Form";
import AvailabilityGrid from "./AvailabilityGrid";

/**
 * This is used in the form in which the user enters their
 * name if they are not logged in when filling out
 * their availability.
 */
type AnonAvailabilityInputs = {
  name: string;
};
const AnonAvailabilitySchema = z.object({ name: z.string() });

/** The shape of the inputs that the mutation requires. */
type AvailabilityAPIInputs = z.infer<typeof CREATE_AVAILABILITY_API_SCHEMA>;

function AvailabilityInput({ schedule }: AvailabilityProps) {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  // const setScheduleAvailability = trpc.schedule.setAvailability.useMutation({
  //   onSuccess: (data, variables) => {
  //     const { name, id } = data;
  //     queryClient.setQueryData(
  //       [
  //         ["schedule", "getScheduleFromSlugId"],
  //         {
  //           name,
  //           id: id.substring(id.length - 8),
  //         } as RouterInputs["schedule"]["getScheduleFromSlugId"],
  //       ],
  //       (prevData) => {
  //         const newData =
  //           prevData as RouterOutputs["schedule"]["getScheduleFromSlugId"];
  //         return updateSchedule(variables, newData);
  //       }
  //     );
  //   },
  // });
  const createAvailability = trpc.availability.createAvailability.useMutation();
  const [guestUser, setGuestUser] = useState<string>("");
  const [, setNoticeMessage] = useAtom(notice);
  const [selectedCells, setSelectedCells] = useState<CalendarDays>({});
  const [isDisabled, setIsDisabled] = useAtom(disabled);
  const [, setIsUpated] = useAtom(updated);

  /** Sets the grid to render all previously entered timeslots from the user. */
  const onSuccess = () => {
    console.log("ehgre ? ? ?");
    // if (!attendees) {
    //   return;
    // }
    // const user = sessionData?.user?.id ?? guestUser;
    // const userAvailability = attendees.filter(
    //   (attendee) => attendee.user === user
    // )[0];
    // const oldAvailability: string[] = [];
    // Object.entries(userAvailability?.availability ?? {}).forEach(
    //   ([date, hours]) => {
    //     const times = hours as string[];
    //     times.forEach((time) => {
    //       oldAvailability.push(`${date}:${time}`);
    //     });
    //   }
    // );
    // setSelectedCells([...oldAvailability]);
  };

  /** Handles reformatting of the data to fit the API. */
  const userFullName = trpc.user.getUserFullName.useQuery(
    sessionData?.user?.id ?? "",
    {
      enabled: sessionData?.user !== undefined || guestUser !== "",
      refetchOnWindowFocus: false,
      onSuccess: () => onSuccess(),
    }
  );

  const save = async () => {
    const name = getUserDisplayName(userFullName.data) ?? guestUser;

    const availabilityData: AvailabilityAPIInputs = {
      userId: sessionData?.user?.id,
      name,
      scheduleId: schedule.id,
      availability: JSON.stringify(selectedCells),
    };

    await createAvailability.mutateAsync(availabilityData, {
      onSuccess: () => {
        setIsUpated(true);
        setNoticeMessage({
          action: "close",
          icon: "check",
          message: "Availability has been saved!",
        });
        setIsDisabled(true);
      },
    });
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
          <AvailabilityGrid
            schedule={schedule}
            mode="write"
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
          />
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

/** Handles optimistic updates to a user's availability. */
function updateSchedule(
  variables: {
    id: string;
    attendee: string;
  },
  newData: RouterOutputs["schedule"]["getScheduleFromSlugId"]
) {
  // if attendees is null, just set it to an empty array
  // const prevAttendees = (newData?.attendees ?? []) as UserAvailability[];
  const prevAttendees = [];
  console.log(variables);
  // const updatedAvailability = JSON.parse(
  //   variables.attendee
  // ) as UserAvailability;

  // const prevAvailability = prevAttendees.find(
  //   (attendee) => attendee.user === updatedAvailability.user
  // );
  // // when a new user sets their availablity, just add their availability to the current schedule
  // if (!prevAvailability) {
  //   return { ...newData, attendees: [...prevAttendees, updatedAvailability] };
  // }
  // // otherwise, update their old availability
  // const newAttendees = prevAttendees?.map((attendee) => {
  //   if (attendee.user === updatedAvailability.user) {
  //     return updatedAvailability;
  //   }
  //   return attendee;
  // });

  // return { ...newData, attendees: newAttendees };
}

/** Gets the name  */
function getUserDisplayName(
  user: Pick<User, "firstName" | "lastName"> | null | undefined
): string | undefined {
  if (!user) {
    return;
  }
  return `${user.firstName}${user.lastName ? `${user.lastName}` : ""}`;
}

export default AvailabilityInput;
