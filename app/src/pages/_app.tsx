/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import { trpc } from "../utils/trpc";

import Layout from "../layouts/Layout";
import "../styles/globals.css";

config.autoAddCss = false;

const MyApp: AppType<{ session: Session | null }> = function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
