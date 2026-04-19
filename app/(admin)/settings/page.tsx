"use client";

import { SaveButton } from "@/components/settings/save-button";
import { useSettings } from "@/hooks/use-settings";
import { AboutSettings } from "@/components/settings/about-settings";
import { useTranslation } from "@/lib/i18n";
import { WidgetsSettings } from "@/components/settings/widgets-settings";
import { LanguageSettings } from "@/components/settings/language-settings";
import { IntegrationsSettings } from "@/components/settings/integrations-settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  
  const { language, setLanguage, widgets, isLoading, isSaving, isSaved, toggleWidget, saveSettings } = useSettings();

  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-(--axis-surface) px-6 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-(--axis-border) opacity-30" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-(--axis-accent)" />
          </div>
          <p className="text-sm text-(--axis-muted)">{t.common.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-(--axis-surface) px-6 py-5 mt-10 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-(--axis-text)">{t.settings.title}</h1>
          <p className="mt-1 text-sm text-(--axis-muted)">{t.settings.subtitle}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LanguageSettings
          language={language}
          onLanguageChange={setLanguage}
          t={t}
        />

        <WidgetsSettings
          enabledWidgets={widgets}
          onToggle={toggleWidget}
          t={t}
        />

        <IntegrationsSettings t={t} />

        <AboutSettings t={t} />
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button 
          disabled={isSaving}
          className="rounded-xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-2.5 text-sm font-medium text-(--axis-muted) hover:bg-(--axis-surface) transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.common.cancel}
        </button>
        <SaveButton
          saving={isSaving}
          saved={isSaved}
          onClick={saveSettings}
          t={t}
        />
      </div>
    </section>
  );
}
