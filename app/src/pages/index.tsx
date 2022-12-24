import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
// import { signIn, signOut, useSession } from "next-auth/react";

import Landing from "../components/Landing";
import { menuOpen } from "../components/nav/Navbar";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const { data, status } = useSession();
  const [isMenuOpen] = useAtom(menuOpen);

  return (
    <>
      <Head>
        <title key="title">LinkUp</title>
        <meta
          key="description"
          name="description"
          content="A scheduling website"
        />
        <meta key="author" name="author" content="Lee Suan, Lindsey Duong" />
        <link key="icon" rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <Landing />
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
