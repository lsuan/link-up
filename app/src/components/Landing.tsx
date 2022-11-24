import Link from "next/link";

function Landing() {
  return (
    <section>
      <h1>Are you down to LinkUp?</h1>
      <Link href="/login">Get Started</Link>
    </section>
  );
}

export default Landing;
