import { Toggle } from "./toggle";
import { RiNotification3Line } from "react-icons/ri";

const notificationOptions = [
  { id: "push", key: "push" },
  { id: "tasks", key: "tasks" },
  { id: "calendar", key: "calendar" },
];

type NotificationsSettingsProps = {
  notifications: Record<string, boolean>;
  onToggle     : (id: string) => void;
  t            : Record<string, any>;
};

export const NotificationsSettings = ({ notifications, onToggle, t }: NotificationsSettingsProps) => (
  <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
        <RiNotification3Line className="h-5 w-5 text-amber-500" />
      </div>

      <div>
        <h3 className="font-semibold text-(--axis-text)">
          {t.settings.notifications.title}
        </h3>

        <p className="text-xs text-(--axis-muted)">
          {t.settings.notifications.description}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {notificationOptions.map((notif) => (
        <div
          key={notif.id}
          className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
        >
          <div>
            <p className="text-sm font-medium text-(--axis-text)">
              {
                t.notifications[notif.key as keyof typeof t.notifications]
                  ?.label
              }
            </p>

            <p className="text-xs text-(--axis-muted)">
              {
                t.notifications[notif.key as keyof typeof t.notifications]
                  ?.description
              }
            </p>
          </div>
          
          <Toggle
            enabled={notifications[notif.id] ?? false}
            onChange={() => onToggle(notif.id)}
          />
        </div>
      ))}
    </div>
  </div>
);
