import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import DashboardEventCard from "../components/dashboard/DashboardEventCard";
import Pill from "../components/dashboard/Pill";
import UnstartedCard from "../components/dashboard/UnstartedCard";
import Loading from "../components/shared/Loading";
import Unauthenticated from "../components/shared/Unauthenticated";
import { getHost } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

function Dashboard() {
  const { status, data: sessionData } = useSession();
  const [active, setActive] = useState<string>("upcoming");
  const unstartedQuery = trpc.schedule.getUnstartedSchedules.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    }
  );

  const upcomingQuery = trpc.event.getUpcoming.useQuery(undefined, {
    enabled: status === "authenticated",
    refetchOnWindowFocus: false,
  });

  if (
    status === "loading" ||
    (status === "authenticated" && upcomingQuery.isLoading)
  ) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <section className="min-h-screen px-8">
      <header className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-300 hover:text-blue-700"
        >
          <FontAwesomeIcon size={"sm"} icon={faPlus} />
          Create
        </Link>
      </header>

      <div className="mb-4 flex justify-between gap-1 rounded-full border border-gray-500 bg-neutral-500">
        <Pill
          name="upcoming"
          active={active}
          setActive={setActive}
          amount={upcomingQuery.data?.length ?? 0}
        />
        <Pill
          name="unstarted"
          active={active}
          setActive={setActive}
          amount={unstartedQuery.data?.length ?? 0}
        />
      </div>
      {active === "upcoming" ? (
        <div className="flex flex-col gap-4">
          {upcomingQuery.data?.map((event, index) => {
            return (
              <DashboardEventCard
                key={event.id}
                scheduleName={event.schedule.name}
                host={getHost(sessionData?.user?.id!, event.schedule)}
                {...event}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {unstartedQuery.data?.map((schedule) => {
            return (
              <UnstartedCard
                key={schedule.id}
                id={schedule.id}
                name={schedule.name}
                description={schedule.description}
                host={getHost(sessionData?.user?.id!, schedule)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
