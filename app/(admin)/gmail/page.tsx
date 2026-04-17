import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchGmailMessages } from "@/services/google-service";
import GmailPageContent from "./gmail-page-client";

export const dynamic = "force-dynamic";

const GmailPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const messagesResult = await fetchGmailMessages(50);
  const messages       = messagesResult.ok ? messagesResult.data : [];

  return <GmailPageContent messages={messages} />;
};

export default GmailPage;
