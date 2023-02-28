import Button from "@ui/Button";
import Typography from "@ui/Typography";
import { useSession } from "next-auth/react";
import Loading from "./shared/Loading";

function Landing() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <section className="flex flex-col justify-center gap-12 px-8 text-center">
      <Typography intent="h1">Ready to LinkUp?</Typography>
      <Typography>
        Plan big meetings with ease! Manage your schedules and events all in one
        place.
      </Typography>
      <Button href={status === "authenticated" ? "/dashboard" : "/signup"}>
        Get Started
      </Button>
    </section>
  );
}

export default Landing;
