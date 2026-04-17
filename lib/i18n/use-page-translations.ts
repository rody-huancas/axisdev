"use client";

import { useTranslation } from "@/lib/i18n";

export function usePageTranslations() {
  const { t } = useTranslation();
  return t;
}
