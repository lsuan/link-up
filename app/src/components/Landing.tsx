import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./shared/Loading";

function Landing() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <section className="flex flex-col justify-center gap-12 px-8 text-center">
      <h1 className="text-3xl font-semibold">Ready to LinkUp?</h1>
      <p className="text-center text-xl">
        Plan big meetings with ease! Manage your schedules and events all in one
        place.
      </p>
      <Link
        href={status === "authenticated" ? "/dashboard" : "/signup"}
        className="rounded-lg bg-neutral-500 p-2 hover:bg-neutral-300 hover:text-black"
      >
        Get Started
      </Link>
    </section>
  );
}

export default Landing;
