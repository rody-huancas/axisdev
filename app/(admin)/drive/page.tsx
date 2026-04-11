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
  const folderName     = resolvedParams?.name || null;
  const filesResult    = await fetchDriveFiles(folderId);
  const files          = filesResult.ok ? filesResult.data : [];

  return (
    <section className="space-y-6">
      <DashboardHeader
        userName={session.user?.name?.split(" ")[0] ?? "Usuario"}
        userEmail={session.user?.email ?? null}
        userImage={session.user?.image ?? null}
      />

      <section className="space-y-6 pt-28">
        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) px-6 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
              <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">
                Explorador de archivos
              </h1>
              {folderId !== "root" && (
                <p className="mt-2 text-sm text-(--axis-muted)">
                  Mostrando: {folderName ?? "Carpeta"}
                </p>
              )}
            </div>
            <span className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-(--axis-muted)">
              {files.length} items
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
          <FileGrid
            files={files}
            currentFolderId={folderId}
            currentFolderName={folderName}
          />
        </div>
      </section>
    </section>
  );
};

export default DrivePage;
