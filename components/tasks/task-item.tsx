import { cn } from "@/lib/utils";
import type { TareaPendiente } from "@/services/google-service";
import { RiCheckboxCircleLine, RiCheckboxLine, RiAddLine } from "react-icons/ri";

type TaskItemProps = {
  task         : TareaPendiente;
  onToggle     : (task: TareaPendiente, completed: boolean) => void;
  onSelect    ?: (task: TareaPendiente) => void;
  subtasks    ?: TareaPendiente[];
  onAddSubtask?: (parentId: string) => void;
};

export const TaskItem = (props: TaskItemProps) => {
  const { task, onToggle, onSelect, subtasks, onAddSubtask } = props;

  const isCompleted = task.estado === "completada";

  return (
    <div className="space-y-2">
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
            onToggle(task, !isCompleted);
          }}
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition",
            isCompleted
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
              : "border-border text-transparent hover:border-accent",
          )}
          title={
            isCompleted ? "Marcar como pendiente" : "Marcar como completada"
          }
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

        {onAddSubtask && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubtask(task.id);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border text-muted opacity-0 transition hover:border-accent hover:text-accent group-hover:opacity-100"
            title="Agregar subtarea"
          >
            <RiAddLine className="h-4 w-4" />
          </button>
        )}
      </div>

      {subtasks && subtasks.length > 0 && (
        <div className="ml-11 space-y-2">
          {subtasks.map((st) => (
            <TaskItem
              key={st.id}
              task={st}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
