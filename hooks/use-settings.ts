"use client";

import { useState, useEffect, useCallback } from "react";
import { sileo } from "sileo";
import { useTranslation } from "@/lib/i18n";
import { Language } from "@/lib/i18n/translations";
import { settingsApi } from "@/services/settings-api";

export const useSettings = () => {
  const { t } = useTranslation();
  
  const [language, setLanguage] = useState<Language>("es");
  const [widgets, setWidgets] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.get();
        
        if (data) {
          const lang = (data.language === "en" ? "en" : "es") as Language;
          setLanguage(lang);
          localStorage.setItem("language", lang);
          
          const widgetMap: Record<string, boolean> = {};
          (data.widgets || []).forEach((w) => {
            widgetMap[w.id] = w.enabled;
          });
          setWidgets(widgetMap);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const toggleWidget = useCallback((id: string) => {
    setWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      await settingsApi.save({
        language,
        widgets: Object.entries(widgets).map(([id, enabled]) => ({ id, enabled })),
      });
      
      localStorage.setItem("language", language);
      window.dispatchEvent(new CustomEvent("language-changed", { detail: language }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      sileo.success({ title: t.common.saved });
    } catch (err) {
      console.error("Error saving settings:", err);
      sileo.error({ title: t.settings.saveError });
    } finally {
      setIsSaving(false);
    }
  }, [language, widgets, t]);

  return {
    language,
    setLanguage,
    widgets,
    isLoading,
    isSaving,
    isSaved,
    toggleWidget,
    saveSettings,
  };
};
