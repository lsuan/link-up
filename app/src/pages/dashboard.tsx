import { useSession } from "next-auth/react";
import Link from "next/link";

function Dashboard() {
  const { data } = useSession();
  return (
    <section className="min-h-screen">
      <h1>User Dashboard</h1>
      <Link href="/create">Plan a Schedule</Link>
    </section>
  );
}

export default Dashboard;
