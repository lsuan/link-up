import Link from "next/link";

function Dashboard() {
  return (
    <section>
      <h1>User Dashboard</h1>
      <Link href="/create">Create an Event</Link>
    </section>
  );
}

export default Dashboard;
