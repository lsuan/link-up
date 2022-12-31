import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import EventCard from "../components/dashboard/EventCard";
import Pill from "../components/dashboard/Pill";

type Event = {
  id: string;
  scheduleName: string;
  name?: string;
  date?: Date;
  start?: number;
  end?: number;
  location?: string;
  description?: string;
};

const unstarted: Event[] = [
  {
    id: "4",
    scheduleName: "Project Live",
  },
];

const upcoming: Event[] = [
  {
    id: "1",
    scheduleName: "New Year's Party",
    name: "Happy New Year!",
    date: new Date("12/31/2022"),
    start: 1672545600,
    end: 1672560000,
    location: "My House",
    description:
      "This is a potluck party so bring your own food, snacks, drinks, or utensils! The more food, the merrier! We will also be watching the Countdown. Event says until 12am, but y'all can leave whenever.",
  },
  {
    id: "2",
    scheduleName: "Project Meeting",
    name: "User Testing Responses!",
    date: new Date("1/4/2022"),
    start: 1673128800,
    end: 1673139600,
    location: "Zoom Link",
    description:
      "Be ready with User Testing responses. We will discuss test outcomes and iterate over design",
  },
  {
    id: "3",
    scheduleName: "Project Meeting",
    name: "General",
    date: new Date("1/11/2022"),
    start: 1673736000,
    end: 1673744400,
    location: "Zoom Link",
    description: "Have revisions to design done.",
  },
];

function Dashboard() {
  const { data } = useSession();
  const [active, setActive] = useState<string>("upcoming");

  return (
    <section className="min-h-screen">
      <header className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-300 hover:text-blue-700"
        >
          <FontAwesomeIcon size={"sm"} icon={faPlus} />
          Create
        </Link>
      </header>

      <div className="mb-4 flex justify-between gap-2 rounded-full border border-gray-500 bg-neutral-500">
        <Pill
          name={"upcoming"}
          active={active}
          setActive={setActive}
          amount={upcoming.length}
        />
        <Pill
          name={"ongoing"}
          active={active}
          setActive={setActive}
          amount={unstarted.length}
        />
      </div>
      {active === "upcoming" ? (
        <div className="flex flex-col gap-4">
          {upcoming.map((event) => {
            return <EventCard key={event.id} {...event} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {unstarted.map((event) => {
            return <EventCard key={event.id} {...event} />;
          })}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
