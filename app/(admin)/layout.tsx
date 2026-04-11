import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

const AdminLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-(--axis-bg) text-(--axis-text)">
      <AdminSidebar />
      <main className="min-h-screen px-5 pb-10 pt-24 lg:ml-72 lg:px-10 lg:pt-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
