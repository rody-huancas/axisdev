import { cn } from "@/lib/utils";
import type { TareaPendiente } from "@/services/google-service";
import { taskIconColor } from "@/lib/tasks-utils";
import { RiCheckboxCircleLine, RiCheckboxLine } from "react-icons/ri";

type TaskItemProps = {
  task: TareaPendiente;
  onToggle: (id: string, completed: boolean) => void;
  onSelect?: (task: TareaPendiente) => void;
};

export const TaskItem = ({ task, onToggle, onSelect }: TaskItemProps) => {
  const isCompleted = task.estado === "completada";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(task);
        }
      }}
      className={cn(
        "group flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))] hover:bg-surface-strong hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]",
        isCompleted && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id, !isCompleted);
        }}
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition",
          isCompleted
            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
            : "border-border text-transparent hover:border-accent",
        )}
        title={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
      >
        {isCompleted ? (
          <RiCheckboxCircleLine className="h-4 w-4" />
        ) : (
          <RiCheckboxLine className="h-4 w-4" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold text-text",
            isCompleted && "line-through text-muted",
          )}
        >
          {task.titulo}
        </p>
        {task.vence && (
          <p
            className={cn(
              "mt-1 text-xs",
              !isCompleted && task.vence ? "text-rose-400" : "text-muted",
            )}
          >
            {task.vence}
          </p>
        )}
      </div>
    </div>
  );
};

type TaskListProps = {
  tasks: TareaPendiente[];
  onToggle: (id: string, completed: boolean) => void;
  onSelect?: (task: TareaPendiente) => void;
};

export const TaskList = ({ tasks, onToggle, onSelect }: TaskListProps) => {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-[color-mix(in_srgb,var(--axis-bg)_40%,transparent)] px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-strong ring-1 ring-border">
          <RiCheckboxCircleLine className="h-7 w-7 text-muted" />
        </div>
        <p className="mt-4 text-sm font-semibold text-text">No hay tareas</p>
        <p className="mt-1 max-w-sm text-sm text-muted">Tu lista de tareas esta vacia.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </div>
  );
};