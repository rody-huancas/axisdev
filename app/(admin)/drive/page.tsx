import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FileGrid } from "@/components/drive/file-grid";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { fetchDriveFiles } from "@/services/google-service";

export const dynamic = "force-dynamic";

type DrivePageProps = {
  searchParams?: Promise<{ folder?: string; name?: string }>;
};

const DrivePage = async ({ searchParams }: DrivePageProps) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const resolvedParams = searchParams ? await searchParams : undefined;
  const folderId       = resolvedParams?.folder || "root";
  const folderName     = resolvedParams?.name   || null;
  const filesResult    = await fetchDriveFiles(folderId);
  const files          = filesResult.ok ? filesResult.data : [];

  return (
    <section className="space-y-6">
      <DashboardHeader
        userName={session.user?.name?.split(" ")[0] ?? "Usuario"}
        userEmail={session.user?.email ?? null}
        userImage={session.user?.image ?? null}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">Archivos</h1>
          <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">
            Busca, sube y organiza tus archivos de Google Drive sin salir del panel.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">
          {files.length} {files.length === 1 ? "elemento" : "elementos"}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <FileGrid files={files} currentFolderId={folderId} currentFolderName={folderName} />
      </div>
    </section>
  );
};

export default DrivePage;
