import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("in jwt");
      console.log(user);

      if (user && token) {
        token.id = user.id as string;
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("in session");
      console.log(session);
      console.log("end of session");
      // if (session.user && user) {
      //   session.user.id = user.id;
      // }

      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    // TODO: check for hashed password
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findFirst({
          where: {
            email: email,
            password: password,
          },
        });

        return user;
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 15 * 24 * 30 * 60, // might change this later, currently sets it to expire in 15 days
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
