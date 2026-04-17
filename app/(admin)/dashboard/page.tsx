import { redirect } from "next/navigation";
import type { TareaPendiente } from "@/lib/types/google-service";
import { auth } from "@/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskSection } from "@/components/dashboard/task-section";
import { DriveSection } from "@/components/dashboard/drive-section";
import { StorageCards } from "@/components/dashboard/storage-cards";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { UrgentSection } from "@/components/dashboard/urgent-section";
import { MyTasksSection } from "@/components/dashboard/my-tasks-section";
import { LearningCharts } from "@/components/dashboard/learning-charts";
import { GreetingSection } from "@/components/dashboard/greeting-section";
import { RecentFilesSection } from "@/components/dashboard/recent-files-section";
import { RecentEmailsSection } from "@/components/dashboard/recent-emails";
import { getOrCreateUserSettings } from "@/lib/settings";
import { computeStorageBreakdown, computeWeeklyBars, computeTaskStats } from "@/lib/utils/dashboard-storage";
import { fetchCalendarEvents, fetchGmailPreview, fetchGmailUnreadCount, fetchRecentFiles, fetchStorageInfo, fetchTasksPreview } from "@/services";

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

  const [
    filesResult,
    eventsResult,
    storageResult,
    tasksResult,
    gmailResult,
    gmailUnreadResult,
    settings,
  ] = await Promise.all([
    fetchRecentFiles(),
    fetchCalendarEvents(),
    fetchStorageInfo(),
    fetchTasksPreview(),
    fetchGmailPreview(),
    fetchGmailUnreadCount(),
    getOrCreateUserSettings(userEmail!),
  ]);

  const enabledWidgets =
    settings.widgets?.reduce(
      (acc, w) => {
        acc[w.id] = w.enabled;
        return acc;
      },
      {} as Record<string, boolean>,
    ) ?? {};

  const driveFiles       = filesResult.ok  ? filesResult.data : [];
  const calendarEvents   = eventsResult.ok ? eventsResult.data : [];
  const tasks            = tasksResult.ok  ? tasksResult.data : [];
  const gmailMessages    = gmailResult.ok  ? gmailResult.data : [];
  const gmailUnreadCount = gmailUnreadResult.ok ? gmailUnreadResult.data : 0;
  const storageInfo      = storageResult.ok ? storageResult.data : { usadoGb: 0, limiteGb: 0, porcentaje: 0 };

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
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6 min-w-0">
          <DashboardHero userName={userName} />

          <StorageCards />

          <StatsCards
            gmailCount={gmailUnreadCount}
            tasksCount={taskStats.pending}
            eventsCount={todayEvents.length}
            storageUsed={storageInfo.usadoGb}
          />

          {enabledWidgets.recentFiles && (
            <RecentFilesSection files={driveFiles} />
          )}

          {enabledWidgets.gmail && (
            <RecentEmailsSection messages={gmailMessages} />
          )}
        </div>

        <aside className="space-y-6 min-w-0">
          <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
            <GreetingSection
              userName={userName}
              eventsCount={calendarEvents.length}
              todayEventsCount={todayEvents.length}
            />

            <div className="mt-6">
              <LearningCharts
                progress={storageInfo.porcentaje || 0}
                weeklyBars={weeklyBars}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-(--axis-muted)">
                Almacenamiento usado
              </p>
              <p className="text-2xl font-semibold text-(--axis-text)">
                {storageInfo.usadoGb} GB
                <span className="text-sm font-normal text-(--axis-muted)">
                  {" "}
                  / {storageInfo.limiteGb} GB
                </span>
              </p>
              <div className="mt-1 h-2 rounded-full bg-(--axis-surface-strong)">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
                  style={{ width: `${storageInfo.porcentaje}%` }}
                />
              </div>
            </div>
          </div>

          <DriveSection
            fileCount={driveFiles.length}
            breakdown={driveBreakdownChart}
          />

          <TaskSection
            total={tasks.length}
            pending={taskStats.pending}
            completed={taskStats.completed}
          />

          <UrgentSection tasks={upcomingTasks} />

          <MyTasksSection tasks={tasks} />
        </aside>
      </section>
    </section>
  );
};

export default DashboardPage;
