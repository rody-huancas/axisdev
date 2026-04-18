import type { TareaPendiente } from "@/services/google-service";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { TaskItem } from "./task-item";


type TaskListProps = {
  tasks        : TareaPendiente[];
  onToggle     : (task: TareaPendiente, completed: boolean) => void;
  onSelect    ?: (task: TareaPendiente) => void;
  getSubtasks ?: (parentId: string) => TareaPendiente[];
  onAddSubtask?: (parentId: string) => void;
};

export const TaskList = ({ tasks, onToggle, onSelect, getSubtasks, onAddSubtask }: TaskListProps) => {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-[color-mix(in_srgb,var(--axis-bg)_40%,transparent)] px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-strong ring-1 ring-border">
          <RiCheckboxCircleLine className="h-7 w-7 text-muted" />
        </div>
        <p className="mt-4 text-sm font-semibold text-text">No hay tareas</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Tu lista de tareas esta vacia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onSelect={onSelect}
          subtasks={getSubtasks?.(task.id)}
          onAddSubtask={onAddSubtask}
        />
      ))}
    </div>
  );
};
