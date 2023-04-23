// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  type Event,
  type Schedule,
  type User,
} from "@prisma/client";
import {
  getHourNumber,
  type UserAvailability,
} from "../src/utils/availabilityUtils";
import { getFormattedHours } from "../src/utils/formUtils";
import { hashPassword } from "../src/utils/passwordUtils";

const prisma = new PrismaClient();
type NewUser = Omit<User, "id">;
type NewSchedule = Omit<Schedule, "id" | "createdAt" | "attendees">;
type ScheduleTimes = Omit<
  NewSchedule,
  "name" | "description" | "numberOfEvents" | "userId" | "attendees"
>;
type Attendees = Pick<Schedule, "attendees"> | undefined;
type NewEvent = Omit<Event, "id">;

const NUMBER_OF_USERS = 10;
const NUMBER_OF_SCHEDULES = 10;
const SCHEDULE_TIMES: readonly ScheduleTimes[] = [
  {
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-07"),
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    deadline: new Date("2023-04-29"),
    lengthOfEvents: "2 hours",
  },
  {
    startDate: new Date("2023-05-07"),
    endDate: new Date("2023-05-09"),
    startTime: "9:00 AM",
    endTime: "8:00 PM",
    deadline: new Date("2023-05-05"),
    lengthOfEvents: "3 hours",
  },
  {
    startDate: new Date("2023-05-11"),
    endDate: new Date("2023-05-17"),
    startTime: "1:00 PM",
    endTime: "8:00 PM",
    deadline: new Date("2023-05-10"),
    lengthOfEvents: "2 hours",
  },
  {
    startDate: new Date("2023-05-17"),
    endDate: new Date("2023-05-25"),
    startTime: "12:00 PM",
    endTime: "5:00 PM",
    deadline: null,
    lengthOfEvents: "3 hours",
  },
  {
    startDate: new Date("2023-05-26"),
    endDate: new Date("2023-05-30"),
    startTime: "1:00 PM",
    endTime: "10:00 PM",
    deadline: null,
    lengthOfEvents: "4 hours",
  },
  {
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-06-13"),
    startTime: "11:00 AM",
    endTime: "6:00 PM",
    deadline: null,
    lengthOfEvents: "4 hours",
  },
  {
    startDate: new Date("2023-06-14"),
    endDate: new Date("2023-06-20"),
    startTime: "10:00 AM",
    endTime: "10:00 PM",
    deadline: new Date("2023-06-12"),
    lengthOfEvents: "3 hours",
  },
  {
    startDate: new Date("2023-06-21"),
    endDate: new Date("2023-06-29"),
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    deadline: new Date("2023-06-18"),
    lengthOfEvents: "2 hours",
  },
  {
    startDate: new Date("2023-07-01"),
    endDate: new Date("2023-07-22"),
    startTime: "5:00 AM",
    endTime: "5:00 PM",
    deadline: new Date("2023-06-30"),
    lengthOfEvents: "6 hours",
  },
  {
    startDate: new Date("2023-08-15"),
    endDate: new Date("2023-08-25"),
    startTime: "10:00 AM",
    endTime: "11:59 PM",
    deadline: null,
    lengthOfEvents: "10 hours",
  },
];

const NUMBER_OF_EVENTS = [2, 3, 2, 4, 3, 1, 3, 2, 5, 3] as const;

const getName = (type: "firstName" | "lastName", index: number) => {
  if (type === "firstName") {
    return index % 2 === 0
      ? faker.name.firstName("male")
      : faker.name.firstName("female");
  }
  return index % 2 === 0
    ? faker.name.lastName("male")
    : faker.name.lastName("female");
};

/** Returns a JSONObject of random availability ranges. */
const createAvailability = (
  startDate: Date,
  endDate: Date,
  startHour: number,
  endHour: number
): JSON => {
  const availability = new Map<string, string[]>();

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0] as string;
    const allHours = [];
    for (let hour = startHour; hour < endHour; hour += 0.5) {
      if (Math.random() >= 0.5) {
        allHours.push(`${hour}-${hour + 0.5}`);
      }
    }
    availability.set(dateString, allHours);
  }

  const availabilityString = JSON.stringify(Object.fromEntries(availability));
  return JSON.parse(availabilityString);
};

/** Creates a JSONArray of attendees for a schedule. */
const createAttendees = (
  users: User[],
  index: number,
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string
): Attendees => {
  const unstartedIndices = [3, 5, 8, 9];
  if (unstartedIndices.includes(index)) {
    return;
  }
  const startHour = getHourNumber(startTime);
  const endHour = getHourNumber(endTime);
  const attendees: UserAvailability[] = [];
  const numberOfAttendees = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
  const randomNumber = Math.floor(
    Math.random() * (numberOfAttendees.length - 1)
  );

  for (let i = 0; i < randomNumber; i++) {
    const userIndex = Math.floor(Math.random() * (users.length - 1));
    const user = users[userIndex];
    const isUserNotRecorded =
      attendees.filter((attendee) => attendee.user === user?.id).length === 0;
    if (isUserNotRecorded) {
      attendees.push({
        user: user?.id as string,
        name: `${user?.firstName} ${user?.lastName}`,
        availability: createAvailability(
          startDate,
          endDate,
          startHour,
          endHour
        ),
      });
    }
  }

  const attendeesString = JSON.stringify(attendees);
  return JSON.parse(attendeesString);
};

const getEventEndTime = (schedule: Schedule): string => {
  const eventLength = parseInt(
    schedule?.lengthOfEvents.split(" ")[0] as string
  );
  const endHour = getHourNumber(schedule?.startTime as string) + eventLength;
  return getFormattedHours([endHour], "long")[0] as string;
};

const seed = async () => {
  const password = await hashPassword("Test1234!");
  const newUsers = new Array(NUMBER_OF_USERS).fill(null).map(
    (user, index) =>
      ({
        firstName: getName("firstName", index),
        lastName: getName("lastName", index),
        email: faker.internet.email(),
        password,
        image: faker.internet.avatar(),
      } as NewUser)
  );

  const createUsers = newUsers.map((user) =>
    prisma.user.create({ data: user })
  );
  await prisma.$transaction(createUsers);

  // const dbUsers = await prisma.$transaction(createUsers);

  // const newSchedules = new Array(NUMBER_OF_SCHEDULES)
  //   .fill(null)
  //   .map((schedule, index) => {
  //     const {
  //       startDate,
  //       endDate,
  //       startTime,
  //       endTime,
  //       deadline,
  //       lengthOfEvents,
  //     } = SCHEDULE_TIMES[index] as ScheduleTimes;
  //     const numberOfEvents = NUMBER_OF_EVENTS[index];

  //     return {
  //       name: `Schedule ${index + 1}`,
  //       description: faker.lorem.sentence(),
  //       startDate,
  //       endDate,
  //       startTime,
  //       endTime,
  //       deadline,
  //       numberOfEvents,
  //       lengthOfEvents,
  //       userId: dbUsers[index]?.id,
  //       attendees: createAttendees(
  //         dbUsers,
  //         index,
  //         startDate,
  //         endDate,
  //         startTime,
  //         endTime
  //       ),
  //     } as NewSchedule;
  //   });

  // const createSchedules = newSchedules.map((schedule) =>
  //   prisma.schedule.create({ data: schedule })
  // );

  //  const dbSchedules = await prisma.$transaction(createSchedules);

  // const newEvents: NewEvent[] = [];
  // NUMBER_OF_EVENTS.forEach((value, index) => {
  //   const schedule = dbSchedules[index];

  //   // only create events for the first 3 schedules
  //   if (index > 2) {
  //     return;
  //   }
  //   for (let i = 0; i < value; i++) {
  //     const currentDate = new Date(schedule?.startDate as Date);
  //     currentDate.setDate((schedule?.startDate?.getDate() ?? 0) + i);
  //     const endTime = getEventEndTime(schedule as Schedule);

  //     newEvents.push({
  //       name: `Event ${i + 1} of ${schedule?.name}`,
  //       date: schedule?.startDate,
  //       startTime: schedule?.startTime,
  //       endTime,
  //       description: faker.lorem.sentence(),
  //       scheduleId: schedule?.id,
  //       location: faker.address.streetAddress(),
  //     } as NewEvent);
  //   }
  // });

  // const createEvents = newEvents.map((event) =>
  //   prisma.event.create({ data: event })
  // );

  // await prisma.$transaction(createEvents);
  await prisma.$disconnect();
};

seed();
