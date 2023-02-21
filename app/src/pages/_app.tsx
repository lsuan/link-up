/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Inter, Montserrat } from "@next/font/google";
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

const inter = Inter({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
});
const montserrat = Montserrat({
  weight: ["500", "600"],
  subsets: ["latin"],
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
