import { type NextPage } from "next";
import Landing from "../components/Landing";

const Home: NextPage = function Home() {
  return (
    <section className="flex h-full flex-col justify-center">
      <Landing />
    </section>
  );
};

export default Home;
