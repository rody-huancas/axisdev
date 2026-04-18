import { cn } from "@/lib/utils";
import type { TareaPendiente } from "@/services/google-service";
import { RiEyeLine, RiCheckboxCircleLine, RiDeleteBin6Line } from "react-icons/ri";

type TaskItemProps = {
  task         : TareaPendiente;
  onToggle     : (task: TareaPendiente, completed: boolean) => void;
  onDelete     : (task: TareaPendiente) => void;
  onSelect     : (task: TareaPendiente) => void;
  tasklistName?: string;
};

export const TaskItemList = ({ task, onToggle, onDelete, onSelect, tasklistName }: TaskItemProps) => {
  const isCompleted = task.estado === "completada";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-3.5 transition-all hover:border-(--axis-accent)/30 hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]",
        isCompleted && "opacity-50",
      )}
    >
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[14px] font-semibold text-(--axis-text)",
            isCompleted && "line-through text-(--axis-muted)",
          )}
        >
          {task.titulo}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {tasklistName && (
            <span className="inline-flex items-center rounded-full bg-(--axis-accent)/15 px-2 py-0.5 text-[10px] font-semibold text-(--axis-accent)">
              {tasklistName}
            </span>
          )}
          
          {task.vence && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
              !isCompleted ? "bg-rose-500/15 text-rose-500" : "bg-(--axis-border)/30 text-(--axis-muted)",
            )}>
              {task.vence}
            </span>
          )}
          
          {task.descripcion && (
            <span className="inline-flex items-center rounded-full bg-(--axis-border)/40 px-2 py-0.5 text-[10px] font-medium text-(--axis-muted) max-w-35 truncate">
              {task.descripcion}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => onSelect(task)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--axis-border) text-(--axis-muted) transition-all hover:border-(--axis-accent) hover:text-(--axis-accent)"
          title="Ver"
        >
          <RiEyeLine className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggle(task, !isCompleted)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
            isCompleted
              ? "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          )}
          title={isCompleted ? "Marcar pendiente" : "Marcar completada"}
        >
          <RiCheckboxCircleLine className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 text-rose-500 transition-all hover:bg-rose-500/10"
          title="Eliminar"
        >
          <RiDeleteBin6Line className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
