import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchTaskList } from "@/services";
import TasksPageContent from "./tasks-page-client";

export const dynamic = "force-dynamic";

const TasksPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const tasksResult = await fetchTaskList();
  const tasks = tasksResult.ok ? tasksResult.data : [];

  return <TasksPageContent tasks={tasks} />;
};

export default TasksPage;
