import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import EventCard from "../components/dashboard/EventCard";

function Dashboard() {
  const { data } = useSession();
  return (
    <section className="min-h-screen">
      <header className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <Link
          href="/create"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-300"
        >
          <FontAwesomeIcon className="text-xl" icon={faPlus} />
        </Link>
      </header>
      <h2 className="mb-4 text-xl">Upcoming</h2>
      <EventCard />
    </section>
  );
}

export default Dashboard;
