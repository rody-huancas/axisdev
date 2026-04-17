import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DriveContent } from "@/components/drive/drive-content";
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

  return <DriveContent files={files} folderId={folderId} folderName={folderName} />;
};

export default DrivePage;
