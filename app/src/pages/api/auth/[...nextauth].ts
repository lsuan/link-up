import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { comparePassword } from "../../../utils/passwordUtils";

// eslint-disable-next-line import/extensions
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const NINETY_DAYS_LOGGED_IN = 90 * 24 * 30 * 60;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && token) {
        token.id = user.id as string;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: NINETY_DAYS_LOGGED_IN,
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findFirst({
          where: { email },
        });

        const isValid =
          user?.password && (await comparePassword(password, user?.password));

        if (isValid) {
          return user;
        }
        return null;
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          firstName: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        };
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,

      profile(profile) {
        const names = profile.name.split(" ");
        return {
          id: profile.sub,
          firstName: names[0],
          lastName: names[names.length - 1],
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id_str,
          firstName: profile.name,
          email: profile.email,
          image: profile.profile_image_url_https,
        };
      },
    }),
    // ...add more providers here
  ],

  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
