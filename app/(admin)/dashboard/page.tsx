import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DriveBreakdownChart } from "@/components/dashboard/drive-breakdown-chart";
import { LearningCharts } from "@/components/dashboard/learning-charts";
import { TaskStatusChart } from "@/components/dashboard/task-status-chart";
import { fetchCalendarEvents, fetchGmailPreview, fetchGmailUnreadCount, fetchRecentFiles, fetchStorageInfo, fetchTasksPreview } from "@/services/google-service";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const userName  = session?.user?.name?.split(" ")[0] ?? "Sofia";
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
  const storageInfo = storageResult.ok
    ? storageResult.data
    : { usadoGb: 0, limiteGb: 0, porcentaje: 0 };

  const classifyStorage = (mimeType: string) => {
    if (mimeType.includes("image") || mimeType.includes("video") || mimeType.includes("audio")) {
      return "Media";
    }
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("presentation") ||
      mimeType.includes("text")
    ) {
      return "Documentos";
    }
    return "Otros";
  };

  const sizeByGroup = driveFiles.reduce<Record<string, number>>((acc, file) => {
    const group = classifyStorage(file.mimeType);
    acc[group] = (acc[group] ?? 0) + file.sizeBytes;
    return acc;
  }, {});

  const countByGroup = driveFiles.reduce<Record<string, number>>((acc, file) => {
    const group = classifyStorage(file.mimeType);
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  const sizeTotal = Object.values(sizeByGroup).reduce((sum, value) => sum + value, 0);
  const countTotal = Object.values(countByGroup).reduce((sum, value) => sum + value, 0);

  const storageBreakdown = ["Documentos", "Media", "Otros"].map((label, index) => {
    const sizeValue = sizeByGroup[label] ?? 0;
    const countValue = countByGroup[label] ?? 0;
    const percentage = sizeTotal
      ? Math.round((sizeValue / sizeTotal) * 100)
      : countTotal ? Math.round((countValue / countTotal) * 100) : 0;
    const tones = [
      "from-indigo-500 to-sky-500",
      "from-fuchsia-500 to-violet-500",
      "from-emerald-500 to-cyan-500",
    ];
    return {
      label,
      percentage,
      tone: tones[index] ?? tones[0],
    };
  });

  const weeklyBars = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const day = date.toISOString().split("T")[0];
    return calendarEvents.filter((event) => event.inicioIso.startsWith(day)).length;
  });

  const pendingTasks = tasks.filter((task) => task.estado !== "completada");
  const completedTasks = tasks.filter((task) => task.estado === "completada");

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
              <button
                className="rounded-2xl bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 shadow-lg transition hover:-translate-y-1"
                type="button"
              >
                Sincronizar ahora
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {storageBreakdown.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-(--axis-text)">{item.label}</p>
                    <p className="text-xs text-(--axis-muted)">Uso estimado</p>
                  </div>
                  <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                    {item.percentage}%
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-(--axis-surface-strong)">
                  <div
                    className={`h-2 rounded-full bg-linear-to-r ${item.tone}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--axis-muted)">Correos</p>
              <p className="mt-3 text-3xl font-semibold text-(--axis-text)">{gmailUnreadCount}</p>
              <p className="mt-1 text-xs text-(--axis-muted)">Sin leer en Inbox</p>
            </div>
            <div className="rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--axis-muted)">Tareas</p>
              <p className="mt-3 text-3xl font-semibold text-(--axis-text)">{pendingTasks.length}</p>
              <p className="mt-1 text-xs text-(--axis-muted)">Pendientes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-(--axis-text)">Drive recientes</h3>
              <button className="text-xs font-semibold text-indigo-500" type="button">
                Ver todo
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {(driveFiles.length
                ? driveFiles.slice(0, 4).map((file, index) => ({
                    title   : file.nombre,
                    category: file.tipo,
                    mentor  : `Actualizado ${file.actualizado}`,
                    progress: Math.min(90, 40 + index * 15),
                    lessons : `Archivo ${index + 1}`,
                    tone    : [
                      "from-violet-500 via-indigo-500 to-sky-500",
                      "from-rose-500 via-fuchsia-500 to-purple-500",
                      "from-sky-500 via-cyan-500 to-emerald-400",
                      "from-emerald-500 via-teal-500 to-cyan-500",
                    ][index % 4],
                  }))
                : storageBreakdown.slice(0, 2).map((item, index) => ({
                    title   : `${item.label} recientes`,
                    category: item.label,
                    mentor  : "Sin datos",
                    progress: item.percentage,
                    lessons : "Actualizado hoy",
                    tone    : index === 0 ? "from-violet-500 via-indigo-500 to-sky-500" : "from-rose-500 via-fuchsia-500 to-purple-500",
                  }))).map((course) => (
                <div
                  key={course.title}
                  className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br ${course.tone} sm:h-20 sm:w-20`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent)]" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                          {course.category}
                        </span>
                        <span className="text-[10px] text-(--axis-muted) truncate">{course.lessons}</span>
                      </div>
                      <p className="text-sm font-semibold text-(--axis-text) truncate">{course.title}</p>
                      <p className="text-xs text-(--axis-muted) truncate">{course.mentor}</p>
                      <div className="mt-2 h-2 rounded-full bg-(--axis-surface-strong)">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                <p className="text-xs text-(--axis-muted)">Eventos de la semana</p>
              </div>
               <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600">
                 {calendarEvents.length}+ eventos
               </span>
            </div>

            <div className="mt-6">
              <LearningCharts progress={storageInfo.porcentaje || 0} weeklyBars={weeklyBars} />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-(--axis-muted)">Almacenamiento usado</p>
              <p className="text-2xl font-semibold text-(--axis-text)">
                {storageInfo.usadoGb} GB
              </p>
              <p className="text-xs text-(--axis-muted)">
                Limite: {storageInfo.limiteGb} GB
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
                <p className="mt-2 text-lg font-semibold text-(--axis-text)">Distribucion</p>
                <p className="text-xs text-(--axis-muted)">Archivos recientes</p>
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
                <p className="text-xs text-(--axis-muted)">Ultimas tareas</p>
              </div>
              <span className="rounded-full bg-(--axis-surface-strong) px-3 py-1 text-[10px] font-semibold text-(--axis-muted)">
                {tasks.length}
              </span>
            </div>
            <div className="mt-6">
              <TaskStatusChart pending={pendingTasks.length} completed={completedTasks.length} />
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--axis-text)">Ultimos correos</h3>
              <button className="text-xs font-semibold text-indigo-500" type="button">
                Ver todos
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(gmailMessages.length ? gmailMessages.slice(0, 3) : []).map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border bg-(--axis-surface-strong) px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-indigo-200 via-purple-200 to-sky-200" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-(--axis-text)">{message.asunto}</p>
                      <p className="truncate text-[10px] text-(--axis-muted)">{message.remitente}</p>
                    </div>
                  </div>
                  <a
                    className="shrink-0 rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-semibold text-indigo-500 transition hover:bg-indigo-50"
                    href={`https://mail.google.com/mail/u/0/#inbox/${message.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir
                  </a>
                </div>
              ))}
              {!gmailMessages.length && (
                <p className="text-sm text-(--axis-muted)">No hay correos recientes.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--axis-text)">Tareas pendientes</h3>
              <button className="text-xs font-semibold text-indigo-500" type="button">
                Ver todo
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(tasks.length ? tasks.slice(0, 3) : []).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-2xl border bg-(--axis-surface-strong) px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-200 via-cyan-200 to-sky-200" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-(--axis-text) truncate">{task.titulo}</p>
                      <p className="text-[10px] text-(--axis-muted) truncate">
                        {task.vence ? `Vence: ${task.vence}` : "Sin fecha"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-(--axis-muted)">
                    {task.estado === "completada" ? "Completada" : "Pendiente"}
                  </span>
                </div>
              ))}
              {!tasks.length && (
                <p className="text-sm text-(--axis-muted)">Sin tareas registradas.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
};

export default DashboardPage;
