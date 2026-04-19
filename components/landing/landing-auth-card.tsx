"use client";

import { UserAuthForm } from "@/components/shared/user-auth-form";
import { usePageTranslations } from "@/lib/i18n";

export const LandingAuthCard = () => {
  const t = usePageTranslations();

  return (
    <div className="max-w-95 rounded-2xl border border-[#DDDBD3] bg-white p-4.5 flex flex-col gap-3">
      <span
        className="text-[9px] uppercase tracking-[0.2em] text-gray-700 font-medium"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {t.landing.auth.title}
      </span>

      <UserAuthForm />

      <p
        className="text-center text-[9px] text-gray-600 tracking-[0.08em]"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {t.landing.auth.note}
      </p>
    </div>
  );
};
