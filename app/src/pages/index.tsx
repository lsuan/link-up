import { type NextPage } from "next";
import { useAtom } from "jotai";
import { updateTitle } from "../layouts/Layout";
import Landing from "../components/Landing";

const Home: NextPage = function Home() {
  const [, setTitle] = useAtom(updateTitle);
  setTitle("Home | LinkUp");
  return (
    <section className="flex h-full flex-col justify-center">
      <Landing />
    </section>
  );
};

export default Home;
