import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrCreateUserSettings, updateUserSettings, getUserSettings } from "@/lib/settings";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getOrCreateUserSettings(session.user.email);

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { language, widgets, notifications } = body;

    const updates: Record<string, unknown> = {};

    if (language !== undefined) {
      updates.language = language;
    }
    if (widgets !== undefined) {
      updates.widgets = widgets;
    }
    if (notifications !== undefined) {
      updates.notifications = notifications;
    }

    const success = await updateUserSettings(session.user.email, updates);

    if (!success) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }

    const updatedSettings = await getUserSettings(session.user.email);

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
