import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TasksClient } from "@/components/tasks/tasks-client";
import { fetchTaskList } from "@/services";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const dynamic = "force-dynamic";

const TasksPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const tasksResult = await fetchTaskList();
  const tasks       = tasksResult.ok ? tasksResult.data : [];

  const pendientes = tasks.filter((t) => t.estado === "pendiente").length;
  const completadas = tasks.filter((t) => t.estado === "completada").length;

  return (
    <section className="space-y-6">
      <DashboardHeader
        userName={session.user?.name?.split(" ")[0] ?? "Usuario"}
        userEmail={session.user?.email ?? null}
        userImage={session.user?.image ?? null}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Tareas</p>
          <h1 className="mt-2 text-2xl font-semibold text-text">Tareas</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Gestiona tus tareas de Google Tasks sin salir del panel.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="rounded-full border border-border bg-surface-strong px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400">
            {pendientes} pendientes
          </span>
          <span className="rounded-full border border-border bg-surface-strong px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
            {completadas} completadas
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <TasksClient initialTasks={tasks} />
      </div>
    </section>
  );
};

export default TasksPage;
