/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Inter, Montserrat } from "@next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import Layout from "../layouts/Layout";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
});

const MyApp: AppType<{ session: Session | null }> = function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={`${inter.variable} ${montserrat.variable}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </div>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
