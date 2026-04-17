"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { translations, Language, TranslationKeys } from "./translations";

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

const LANGUAGE_CHANGE_EVENT = "language-changed";

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [isLoaded, setIsLoaded] = useState(false);

  const loadLanguage = useCallback(() => {
    const stored = localStorage.getItem("language") as Language | null;
    if (stored && (stored === "es" || stored === "en")) {
      setLanguageState(stored);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadLanguage();

    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguageState(event.detail);
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    };
  }, [loadLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: lang }));
  };

  if (!isLoaded) {
    return null;
  }

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
