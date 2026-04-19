"use client";

import { cn } from "@/lib/utils";
import { RiGlobeLine } from "react-icons/ri";
import type { Language } from "@/lib/i18n/translations";

const languages = [
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
];

type LanguageSettingsProps = {
  language        : Language;
  onLanguageChange: (lang: Language) => void;
  t               : Record<string, any>;
};

export const LanguageSettings = ({ language, onLanguageChange, t }: LanguageSettingsProps) => (
  <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6 flex h-full flex-col">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
        <RiGlobeLine className="h-5 w-5 text-violet-500" />
      </div>
      <div>
        <h3 className="font-semibold text-(--axis-text)">
          {t.settings.language.title}
        </h3>
        <p className="text-xs text-(--axis-muted)">
          {t.settings.language.description}
        </p>
      </div>
    </div>
    <div className="mt-1 flex flex-1 items-stretch gap-3">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={cn(
            "flex-1 flex h-full flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 transition",
            language === lang.code
              ? "border-violet-500 bg-violet-500/10"
              : "border-(--axis-border) bg-(--axis-surface) hover:border-violet-500/50",
          )}
        >
          <span className="text-2xl">{lang.flag}</span>
          <span
            className={cn(
              "text-sm font-medium",
              language === lang.code
                ? "text-violet-500"
                : "text-(--axis-muted)",
            )}
          >
            {lang.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);
