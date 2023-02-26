import Button from "@ui/Button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
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
  const { data: unstarted, isLoading: isUnstartedLoading } =
    trpc.schedule.getUnstartedSchedules.useQuery(undefined, {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    });

  const { data: upcoming, isLoading: isUpcomingLoading } =
    trpc.event.getUpcoming.useQuery(undefined, {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    });

  if (status === "loading" || isUnstartedLoading || isUpcomingLoading) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <section className="min-h-screen px-8">
      <header className="mb-12 flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Events</h1>
        <Button href="/create">
          <FiPlus />
          Create
        </Button>
      </header>

      <div className="mb-4 flex justify-between gap-1 rounded-full border border-gray-500 bg-neutral-500">
        <Pill
          name="upcoming"
          active={active}
          setActive={setActive}
          amount={upcoming?.length ?? 0}
        />
        <Pill
          name="unstarted"
          active={active}
          setActive={setActive}
          amount={unstarted?.length ?? 0}
        />
      </div>
      {active === "upcoming" ? (
        <div className="flex flex-col gap-4">
          {upcoming?.map((event) => (
            <DashboardEventCard
              key={event.id}
              scheduleName={event.schedule.name}
              host={getHost(sessionData?.user?.id ?? "", event.schedule)}
              {...event}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {unstarted?.map((schedule) => (
            <UnstartedCard
              key={schedule.id}
              id={schedule.id}
              name={schedule.name}
              description={schedule.description}
              host={getHost(sessionData?.user?.id ?? "", schedule)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
