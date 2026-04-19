"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKeys } from "./translations";

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

const LANGUAGE_CHANGE_EVENT = "language-changed";

function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored && (stored === "es" || stored === "en")) {
      return stored;
    }
  } catch {
    // ignore
  }

  const candidates = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const next: Language = candidates.some((value) => value.startsWith("es")) ? "es" : "en";

  try {
    localStorage.setItem("language", next);
  } catch {
    // ignore
  }

  return next;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguageState(event.detail);
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("language", lang);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: lang }));
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
