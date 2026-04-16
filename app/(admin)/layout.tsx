import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const AdminLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userName = session?.user?.name?.split(" ")[0] ?? "Usuario";
  const userEmail = session?.user?.email ?? null;
  const userImage = session?.user?.image ?? null;

  return (
    <AdminShell>
      <DashboardHeader userName={userName} userEmail={userEmail} userImage={userImage} />
      {children}
    </AdminShell>
  );
};

export default AdminLayout;
