import Button from "@ui/Button";
import Snackbar from "@ui/Snackbar";
import Typography from "@ui/Typography";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAtom } from "jotai";
import DashboardEventCard from "../components/dashboard/DashboardEventCard";
import Pill from "../components/dashboard/Pill";
import UnstartedCard from "../components/dashboard/UnstartedCard";
import Loading from "../components/shared/Loading";
import Unauthenticated from "../components/shared/Unauthenticated";
import { updateTitle } from "../layouts/Layout";
import { getHost } from "../utils/scheduleUtils";
import { trpc } from "../utils/trpc";

function Dashboard() {
  const { status, data: sessionData } = useSession();

  const [, setTitle] = useAtom(updateTitle);
  setTitle("Dashboard | LinkUp");

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
        <Typography intent="h1">Events</Typography>
        <Button href="/create">
          <FiPlus />
          Create
        </Button>
      </header>

      <Snackbar />

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
