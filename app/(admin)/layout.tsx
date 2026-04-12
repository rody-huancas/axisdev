import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/dashboard/admin-shell";

const AdminLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <AdminShell>{children}</AdminShell>
  );
};

export default AdminLayout;
