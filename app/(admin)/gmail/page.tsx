import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GmailClient } from "@/components/gmail/gmail-client";
import { fetchGmailMessages } from "@/services/google-service";

export const dynamic = "force-dynamic";

type GmailPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const GmailPage = async ({ searchParams }: GmailPageProps) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const messagesResult = await fetchGmailMessages(50);
  const messages = messagesResult.ok ? messagesResult.data : [];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Gmail</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">Mensajes</h1>
          <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">
            Lee y gestiona tus correos de Gmail sin salir del panel.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">
          {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <GmailClient initialItems={messages} />
      </div>
    </section>
  );
};

export default GmailPage;