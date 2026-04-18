import { RiInformationLine } from "react-icons/ri";

type AboutSettingsProps = {
  t: Record<string, any>;
};

export const AboutSettings = ({ t }: AboutSettingsProps) => (
  <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10">
        <RiInformationLine className="h-5 w-5 text-rose-500" />
      </div>

      <div>
        <h3 className="font-semibold text-(--axis-text)">
          {t.settings.about.title}
        </h3>
        
        <p className="text-xs text-(--axis-muted)">
          {t.settings.about.description}
        </p>
      </div>
    </div>

    <div className="space-y-3">
      <div className="rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--axis-muted)">{t.about.version}</span>
          <span className="text-sm font-medium text-(--axis-text)">1.0.0</span>
        </div>
      </div>

      <div className="rounded-xl border border-(--axis-border) bg-(--axis-surface) p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--axis-muted)">{t.about.status}</span>
          <span className="flex items-center gap-1 text-sm font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            {t.about.active}
          </span>
        </div>
      </div>
    </div>
  </div>
);
