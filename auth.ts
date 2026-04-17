import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { env } from "@/lib/env";
import { getOrCreateUser } from "@/lib/users";

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
  events: {
    async signIn({ user }) {
      if (user.email) {
        await getOrCreateUser(user.email, user.name ?? undefined, user.image ?? undefined);
      }
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000 - 60000) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method : "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body   : new URLSearchParams({
              client_id    : env.google.clientId,
              client_secret: env.google.clientSecret,
              grant_type   : "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.access_token;
            token.expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
          } else {
            return null;
          }
        } catch {
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token || !token.accessToken) {
        return session;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
