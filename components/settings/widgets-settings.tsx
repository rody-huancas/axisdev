import { Toggle } from "./toggle";
import { RiLayoutGridLine, RiMailLine, RiTaskLine, RiCloudLine, RiCalendarLine, RiFileLine } from "react-icons/ri";

const widgetOptions = [
  { id: "gmail", key: "gmail", icon: <RiMailLine className="h-4 w-4" /> },
  { id: "tasks", key: "tasks", icon: <RiTaskLine className="h-4 w-4" /> },
  {
    id: "calendar",
    key: "calendar",
    icon: <RiCalendarLine className="h-4 w-4" />,
  },
  { id: "storage", key: "storage", icon: <RiCloudLine className="h-4 w-4" /> },
  {
    id: "recentFiles",
    key: "recentFiles",
    icon: <RiFileLine className="h-4 w-4" />,
  },
];

type WidgetsSettingsProps = {
  enabledWidgets: Record<string, boolean>;
  onToggle      : (id: string) => void;
  t             : Record<string, any>;
};

export const WidgetsSettings = ({ enabledWidgets, onToggle, t }: WidgetsSettingsProps) => (
  <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
        <RiLayoutGridLine className="h-5 w-5 text-indigo-500" />
      </div>

      <div>
        <h3 className="font-semibold text-(--axis-text)">
          {t.settings.widgets.title}
        </h3>

        <p className="text-xs text-(--axis-muted)">
          {t.settings.widgets.description}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {widgetOptions.map((widget) => (
        <div
          key={widget.id}
          className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--axis-surface-strong) text-(--axis-muted)">
              {widget.icon}
            </div>
            
            <span className="text-sm font-medium text-(--axis-text)">
              {t.widgets[widget.key as keyof typeof t.widgets]}
            </span>
          </div>
          
          <Toggle
            enabled={enabledWidgets[widget.id] ?? false}
            onChange={() => onToggle(widget.id)}
          />
        </div>
      ))}
    </div>
  </div>
);
