import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { env } from "@/lib/env";

const googleScopes = [
  "openid",
  "email",
  "profile",
  `${env.api.google}/auth/calendar.events`,
  `${env.api.google}/auth/drive.file`,
  `${env.api.google}/auth/drive.readonly`,
  `${env.api.google}/auth/tasks`,
  `${env.api.google}/auth/gmail.readonly`,
].join(" ");

export const authConfig = {
  secret   : env.auth.secret,
  trustHost: true,
  providers: [
    Google({
      clientId     : env.google.clientId,
      clientSecret : env.google.clientSecret,
      authorization: {
        params: {
          scope      : googleScopes,
          access_type: "offline",
          prompt     : "consent",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
