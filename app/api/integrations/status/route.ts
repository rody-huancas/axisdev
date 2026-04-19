import { auth } from "@/auth";
import { env } from "@/lib/env";

type TokenInfoResponse = {
  scope?: string;
};

const requiredScopes = {
  gmail   : `${env.api.google}/auth/gmail.readonly`,
  tasks   : `${env.api.google}/auth/tasks`,
  calendar: `${env.api.google}/auth/calendar.events`,
  drive: [
    `${env.api.google}/auth/drive.readonly`,
    `${env.api.google}/auth/drive.file`,
  ],
} as const;

function splitScopes(value: string) {
  return value
    .split(" ")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET() {
  const session = await auth();
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    return Response.json({ ok: false, error: "tokeninfo_failed" }, { status: 502 });
  }

  const data = (await response.json()) as TokenInfoResponse;
  const scopes = splitScopes(data.scope ?? "");
  const set = new Set(scopes);

  const services = {
    gmail: set.has(requiredScopes.gmail),
    tasks: set.has(requiredScopes.tasks),
    calendar: set.has(requiredScopes.calendar),
    drive: requiredScopes.drive.some((s) => set.has(s)),
  };

  return Response.json({ ok: true, scopes, services });
}
