import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DriveBreakdownChart } from "@/components/dashboard/drive-breakdown-chart";
import { LearningCharts } from "@/components/dashboard/learning-charts";
import { TaskStatusChart } from "@/components/dashboard/task-status-chart";
import { fetchCalendarEvents, fetchGmailPreview, fetchGmailUnreadCount, fetchRecentFiles, fetchStorageInfo, fetchTasksPreview } from "@/services";
import { computeStorageBreakdown, computeWeeklyBars, computeTaskStats } from "@/lib/utils/dashboard-storage";
import type { TareaPendiente } from "@/lib/types/google-service";
import { RiMailLine, RiCalendarLine, RiTaskLine, RiDriveLine, RiExternalLinkLine, RiFileLine, RiCheckLine, RiTimeLine } from "react-icons/ri";

const getTodayEvents = (events: { inicioIso: string }[]) => {
  const today = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.inicioIso.startsWith(today));
};

const getUpcomingTasks = (tasks: TareaPendiente[]) => {
  const today = new Date();
  const inThreeDays = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  return tasks.filter((t) => {
    if (t.estado === "completada" || !t.vence) return false;
    const dueDate = new Date(t.vence.split("/").reverse().join("-"));
    return dueDate <= inThreeDays && dueDate >= today;
  });
};

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userName = session?.user?.name?.split(" ")[0] ?? "Sofia";
  const userEmail = session?.user?.email ?? null;
  const userImage = session?.user?.image ?? null;

  const [filesResult, eventsResult, storageResult, tasksResult, gmailResult, gmailUnreadResult] = await Promise.all([
    fetchRecentFiles(),
    fetchCalendarEvents(),
    fetchStorageInfo(),
    fetchTasksPreview(),
    fetchGmailPreview(),
    fetchGmailUnreadCount(),
  ]);

  const driveFiles = filesResult.ok ? filesResult.data : [];
  const calendarEvents = eventsResult.ok ? eventsResult.data : [];
  const tasks = tasksResult.ok ? tasksResult.data : [];
  const gmailMessages = gmailResult.ok ? gmailResult.data : [];
  const gmailUnreadCount = gmailUnreadResult.ok ? gmailUnreadResult.data : 0;
  const storageInfo = storageResult.ok ? storageResult.data : { usadoGb: 0, limiteGb: 0, porcentaje: 0 };

  const storageBreakdown = computeStorageBreakdown(driveFiles);
  const weeklyBars = computeWeeklyBars(calendarEvents);
  const taskStats = computeTaskStats(tasks);

  const todayEvents = getTodayEvents(calendarEvents);
  const upcomingTasks = getUpcomingTasks(tasks);

  const driveBreakdownChart = storageBreakdown.map((item) => ({
    label: item.label,
    value: item.percentage,
  }));

  return (
    <section className="space-y-6">
      <DashboardHeader userName={userName} userEmail={userEmail} userImage={userImage} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6 min-w-0">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#6C63FF] via-[#5A7BFF] to-[#4DA2FF] p-6 text-white shadow-[0_18px_36px_rgba(108,99,255,0.28)] sm:p-8">
            <div className="absolute -right-10 top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute right-16 top-16 h-20 w-20 rounded-3xl border border-white/20" />
            <div className="absolute bottom-0 left-0 h-28 w-28 -translate-x-8 translate-y-8 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">AxisDev</p>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  Tu centro inteligente de Google Workspace
                </h2>
                <p className="text-sm text-white/80">
                  {userName}, consolida Drive, Calendar, Tasks y Gmail en un solo panel.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-2xl bg-white/20 px-4 py-2 text-xs font-medium text-white">
                  {storageInfo.porcentaje}% usado
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/drive"
              className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--axis-text)">Documentos</p>
                  <p className="text-xs text-(--axis-muted)">Archivos</p>
                </div>
                <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                  {storageBreakdown[0]?.percentage ?? 0}%
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-(--axis-surface-strong)">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
                  style={{ width: `${storageBreakdown[0]?.percentage ?? 0}%` }}
                />
              </div>
            </Link>
            <Link
              href="/drive"
              className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--axis-text)">Media</p>
                  <p className="text-xs text-(--axis-muted)">Videos, imagenes</p>
                </div>
                <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                  {storageBreakdown[1]?.percentage ?? 0}%
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-(--axis-surface-strong)">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500"
                  style={{ width: `${storageBreakdown[1]?.percentage ?? 0}%` }}
                />
              </div>
            </Link>
            <Link
              href="/drive"
              className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--axis-text)">Otros</p>
                  <p className="text-xs text-(--axis-muted)">Otros archivos</p>
                </div>
                <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                  {storageBreakdown[2]?.percentage ?? 0}%
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-(--axis-surface-strong)">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500"
                  style={{ width: `${storageBreakdown[2]?.percentage ?? 0}%` }}
                />
              </div>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/gmail"
              className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <RiMailLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-(--axis-text)">{gmailUnreadCount}</p>
                  <p className="text-xs text-(--axis-muted)">Sin leer</p>
                </div>
              </div>
            </Link>
            <Link
              href="/tasks"
              className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <RiTaskLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-(--axis-text)">{taskStats.pending}</p>
                  <p className="text-xs text-(--axis-muted)">Pendientes</p>
                </div>
              </div>
            </Link>
            <Link
              href="/calendar"
              className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <RiCalendarLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-(--axis-text)">{todayEvents.length}</p>
                  <p className="text-xs text-(--axis-muted)">Hoy</p>
                </div>
              </div>
            </Link>
            <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <RiDriveLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-(--axis-text)">{storageInfo.usadoGb}</p>
                  <p className="text-xs text-(--axis-muted)">GB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-(--axis-text)">Archivos recientes</h3>
              <Link href="/drive" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
                Ver todo <RiExternalLinkLine className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {(driveFiles.length
                ? driveFiles.slice(0, 4).map((file, index) => ({
                    title: file.nombre,
                    category: file.tipo,
                    updated: file.actualizado,
                    progress: Math.min(90, 40 + index * 15),
                    label: `Archivo ${index + 1}`,
                    tone: [
                      "from-violet-500 via-indigo-500 to-sky-500",
                      "from-rose-500 via-fuchsia-500 to-purple-500",
                      "from-sky-500 via-cyan-500 to-emerald-400",
                      "from-emerald-500 via-teal-500 to-cyan-500",
                    ][index % 4],
                  }))
                : storageBreakdown.slice(0, 2).map((item, index) => ({
                    title: `${item.label} recientes`,
                    category: item.label,
                    updated: "Sin datos",
                    progress: item.percentage,
                    label: "Actualizado hoy",
                    tone: index === 0 ? "from-violet-500 via-indigo-500 to-sky-500" : "from-rose-500 via-fuchsia-500 to-purple-500",
                  }))).map((item) => (
                <Link
                  key={item.title}
                  href="/drive"
                  className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br ${item.tone} sm:h-20 sm:w-20`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RiFileLine className="h-6 w-6 text-white/80" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-(--axis-muted)">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-(--axis-text) truncate">{item.title}</p>
                      <p className="text-xs text-(--axis-muted)">Actualizado {item.updated}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 min-w-0">
          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Resumen</p>
                <p className="mt-2 text-lg font-semibold text-(--axis-text)">Buenos dias, {userName}</p>
                <p className="text-xs text-(--axis-muted)">{calendarEvents.length} eventos esta semana</p>
              </div>
              <Link
                href="/calendar"
                className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600 hover:bg-emerald-100"
              >
                {todayEvents.length} hoy
              </Link>
            </div>

            <div className="mt-6">
              <LearningCharts progress={storageInfo.porcentaje || 0} weeklyBars={weeklyBars} />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-(--axis-muted)">Almacenamiento usado</p>
              <p className="text-2xl font-semibold text-(--axis-text)">
                {storageInfo.usadoGb} GB
                <span className="text-sm font-normal text-(--axis-muted)"> / {storageInfo.limiteGb} GB</span>
              </p>
              <div className="mt-1 h-2 rounded-full bg-(--axis-surface-strong)">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
                  style={{ width: `${storageInfo.porcentaje}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
                <p className="mt-2 text-lg font-semibold text-(--axis-text)">Archivos</p>
                <p className="text-xs text-(--axis-muted)">{driveFiles.length} archivos</p>
              </div>
            </div>
            <div className="mt-6">
              <DriveBreakdownChart items={driveBreakdownChart} />
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Tasks</p>
                <p className="mt-2 text-lg font-semibold text-(--axis-text)">Estado</p>
              </div>
              <Link
                href="/tasks"
                className="rounded-full bg-(--axis-surface-strong) px-3 py-1 text-[10px] font-semibold text-(--axis-muted)"
              >
                {tasks.length} total
              </Link>
            </div>
            <div className="mt-6">
              <TaskStatusChart pending={taskStats.pending} completed={taskStats.completed} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-amber-50 p-2">
                <RiTimeLine className="mx-auto h-4 w-4 text-amber-500" />
                <p className="text-lg font-semibold text-(--axis-text)">{taskStats.pending}</p>
                <p className="text-[10px] text-(--axis-muted)">Pendientes</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2">
                <RiCheckLine className="mx-auto h-4 w-4 text-emerald-500" />
                <p className="text-lg font-semibold text-(--axis-text)">{taskStats.completed}</p>
                <p className="text-[10px] text-(--axis-muted)">Completadas</p>
              </div>
            </div>
          </div>

          {upcomingTasks.length > 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Urgente</p>
                  <p className="mt-2 text-lg font-semibold text-(--axis-text)">Proximas a vencer</p>
                  <p className="text-xs text-(--axis-muted)">Vencen en 3 dias</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-600">
                  {upcomingTasks.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {upcomingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                        <RiTaskLine className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-(--axis-text) truncate">{task.titulo}</p>
                        <p className="text-[10px] text-amber-600">Vence: {task.vence}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--axis-text)">Ultimos correos</h3>
              <Link href="/gmail" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
                Ver todos
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {(gmailMessages.length ? gmailMessages.slice(0, 3) : []).map((message) => (
                <a
                  key={message.id}
                  href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border bg-(--axis-surface-strong) px-3 py-3 transition hover:bg-(--axis-surface) cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-200 via-purple-200 to-sky-200" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-(--axis-text)">{message.asunto}</p>
                      <p className="truncate text-[10px] text-(--axis-muted)">{message.remitente}</p>
                    </div>
                  </div>
                  <RiExternalLinkLine className="h-4 w-4 shrink-0 text-indigo-400" />
                </a>
              ))}
              {!gmailMessages.length && (
                <p className="text-sm text-(--axis-muted)">No hay correos recientes.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--axis-text)">Tareas</h3>
              <Link href="/tasks" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
                Ver todo
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {(tasks.length ? tasks.slice(0, 3) : []).map((task) => (
                <Link
                  key={task.id}
                  href="/tasks"
                  className="flex items-center justify-between rounded-2xl border bg-(--axis-surface-strong) px-3 py-3 transition hover:bg-(--axis-surface) cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-emerald-200 via-cyan-200 to-sky-200" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-(--axis-text) truncate">{task.titulo}</p>
                      <p className="text-[10px] text-(--axis-muted)">
                        {task.vence ? `Vence: ${task.vence}` : "Sin fecha"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-(--axis-muted)">
                    {task.estado === "completada" ? "Completada" : "Pendiente"}
                  </span>
                </Link>
              ))}
              {!tasks.length && (
                <p className="text-sm text-(--axis-muted)">Sin tareas.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
};

export default DashboardPage;