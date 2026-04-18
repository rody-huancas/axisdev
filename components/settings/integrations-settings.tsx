import { RiGoogleFill, RiCheckLine } from "react-icons/ri";

const integrationsList = [
  { name: "Gmail", key: "gmail", descriptionKey: "gmailDesc" },
  { name: "Drive", key: "drive", descriptionKey: "driveDesc" },
  { name: "Calendar", key: "calendar", descriptionKey: "calendarDesc" },
];

type IntegrationsSettingsProps = {
  t: Record<string, any>;
};

export const IntegrationsSettings = ({ t }: IntegrationsSettingsProps) => (
  <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
        <RiGoogleFill className="h-5 w-5 text-blue-500" />
      </div>

      <div>
        <h3 className="font-semibold text-(--axis-text)">
          {t.settings.integrations.title}
        </h3>

        <p className="text-xs text-(--axis-muted)">
          {t.settings.integrations.description}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      {integrationsList.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <RiGoogleFill className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-(--axis-text)">
                {t.integrations[item.key as keyof typeof t.integrations]}
              </p>

              <p className="text-xs text-(--axis-muted)">
                {
                  t.integrations[
                    item.descriptionKey as keyof typeof t.integrations
                  ]
                }
              </p>
            </div>
          </div>
          
          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-[10px] font-medium text-green-400">
            <RiCheckLine className="h-3 w-3" />
            {t.integrations.connected}
          </span>
        </div>
      ))}
    </div>
  </div>
);
