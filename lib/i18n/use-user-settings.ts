"use client";

import { useState, useEffect, useTransition } from "react";
import { Language } from "./translations";

type UserSettings = {
  language: Language;
  widgets: { id: string; enabled: boolean }[];
  notifications: { id: string; enabled: boolean }[];
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        
        if (data.settings) {
          const lang = (data.settings.language === "en" ? "en" : "es") as Language;
          setSettings({
            language: lang,
            widgets: data.settings.widgets || [],
            notifications: data.settings.notifications || [],
          });
          
          if (data.settings.language) {
            localStorage.setItem("language", lang);
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const updateLanguage = (lang: Language) => {
    startTransition(async () => {
      setSaving(true);
      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: lang }),
        });
        
        if (res.ok) {
          localStorage.setItem("language", lang);
          setSettings((prev) => prev ? { ...prev, language: lang } : null);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch (err) {
        console.error("Error saving language:", err);
      } finally {
        setSaving(false);
      }
    });
  };

  return { settings, loading, saving, saved, isPending, updateLanguage };
}
