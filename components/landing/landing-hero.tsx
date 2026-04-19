"use client";

import Image from "next/image";
import { usePageTranslations } from "@/lib/i18n";

export const LandingLogo = () => (
  <Image
    src="/axisdev.webp"
    alt="AxisDev"
    width={160}
    height={40}
    className="rounded-xl"
    priority
  />
);

export const LandingBadge = () => (
  <LandingBadgeInner />
);

const LandingBadgeInner = () => {
  const t = usePageTranslations();

  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DDDBD3] bg-white px-3.5 py-1.5">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[10px] text-[#777] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-geist-mono)" }}>
        {t.landing.badge}
      </span>
    </div>
  );
};

export const LandingHeadline = () => (
  <LandingHeadlineInner />
);

const LandingHeadlineInner = () => {
  const t = usePageTranslations();

  return (
    <h1
      style={{
        fontWeight: 900,
        color: "#111",
        lineHeight: 0.92,
        letterSpacing: "-0.05em",
        fontSize: "clamp(40px, 4.8vw, 65px)",
      }}
    >
      <span className="block">{t.landing.headline.line1}</span>
      <span className="block my-1">
        <span className="inline-block rounded-[10px] px-3 pb-2 pt-1" style={{ background: "#BFEF38", lineHeight: 1.0 }}>
          {t.landing.headline.highlight}
        </span>
      </span>
      <span className="block" style={{ color: "#555" }}>
        {t.landing.headline.line3}
      </span>
    </h1>
  );
};

export const LandingDescription = () => (
  <LandingDescriptionInner />
);

const LandingDescriptionInner = () => {
  const t = usePageTranslations();

  return (
    <p
      className="max-w-85 text-[12.5px] leading-[1.75] text-gray-700"
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontWeight: 300,
      }}
    >
      {t.landing.description}
    </p>
  );
};
