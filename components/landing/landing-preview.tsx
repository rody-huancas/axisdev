"use client";

import { usePageTranslations } from "@/lib/i18n";

export const LandingPreview = () => (
  <LandingPreviewInner />
);

const LandingPreviewInner = () => {
  const t = usePageTranslations();

  const previewData = {
    userInitials: t.landing.preview.demoUserInitials,
    userName    : t.landing.preview.demoUserName,
    stats       : [
      { val: "24", label: t.landing.preview.stats.pendingTasks, color: "#16a34a" },
      { val: "6", label: t.landing.preview.stats.meetingsToday, color: "#111" },
      { val: "138", label: t.landing.preview.stats.unreadEmails, color: "#d97706" },
    ],
    services: [
      { icon: "📁", name: t.landing.preview.services.drive, dot: "#4285F4" },
      { icon: "📅", name: t.landing.preview.services.calendar, dot: "#EA4335" },
      { icon: "📧", name: t.landing.preview.services.gmail, dot: "#EA4335" },
      { icon: "✅", name: t.landing.preview.services.tasks, dot: "#34A853" },
      { icon: "☁️", name: t.landing.preview.services.storage, dot: "#FBBC05" },
      { icon: "👥", name: t.landing.preview.services.contacts, dot: "#4285F4" },
    ],
    recentActivity: [
      { icon: "📄", name: t.landing.preview.demoFileName, desc: t.landing.preview.activity.editedInDrive, time: "2m", bg: "#4285F418", color: "#4285F4" },
      { icon: "📅", name: t.landing.preview.activity.teamMeeting, desc: t.landing.preview.activity.todayAt, time: "1h", bg: "#EA443518", color: "#EA4335" },
      { icon: "📧", name: t.landing.preview.activity.messageFromCarlos, desc: t.landing.preview.activity.sprintDeliverables, time: "3h", bg: "#34A85318", color: "#34A853" },
    ],
  };

  return (
    <div className="relative hidden lg:flex justify-center items-center">
      <div className="axis-float w-full max-w-115 overflow-hidden rounded-[18px] border border-[#DDDBD3] bg-white shadow-[0_28px_80px_rgba(17,17,17,0.12)]">
      <div className="flex items-center gap-1.5 border-b border-[#E8E6DF] bg-[#F4F3EE] px-3.5 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-2 flex-1 rounded-md py-1 px-3 text-center text-[9px] text-[#999]" style={{ background: "#EEEDE7", fontFamily: "var(--font-geist-mono)" }}>
          axisdev.app/dashboard
        </div>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#111]" style={{ letterSpacing: "-0.02em" }}>
            {t.landing.preview.dashboardTitle}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#aaa]" style={{ fontFamily: "var(--font-geist-mono)" }}>
              {previewData.userName}
            </span>
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "#111", fontFamily: "var(--font-geist-mono)" }}>
              {previewData.userInitials}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {previewData.stats.map(({ val, label, color }) => (
            <div key={label} className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5" style={{ background: "#F5F4EF" }}>
              <span className="text-[22px] font-extrabold leading-none" style={{ color, letterSpacing: "-0.03em" }}>
                {val}
              </span>
              <span className="text-[8.5px] text-[#999]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[8px] uppercase tracking-[0.18em] text-[#bbb] font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {t.landing.preview.connectedServices}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {previewData.services.map(({ icon, name, dot }) => (
              <div key={name} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2" style={{ background: "#F5F4EF" }}>
                <span className="text-[13px] shrink-0">{icon}</span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[10px] font-semibold text-[#222]">{name}</span>
                  <div className="flex items-center gap-1">
                     <span className="h-1.25 w-1.25 shrink-0 rounded-full" style={{ background: dot }} />
                     <span className="text-[7.5px] text-[#bbb]" style={{ fontFamily: "var(--font-geist-mono)" }}>{t.landing.preview.connected}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>

         <div className="flex flex-col gap-1.5">
           <p className="text-[8px] uppercase tracking-[0.18em] text-[#bbb] font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {t.landing.preview.recentActivity}
           </p>
          <div className="overflow-hidden rounded-xl border border-[#EEECE5]">
            {previewData.recentActivity.map(({ icon, name, desc, time, bg, color }, i, arr) => (
              <div key={name} className="flex items-center gap-2.5 bg-white px-3 py-2.5" style={{ borderBottom: i < arr.length - 1 ? "1px solid #F0EDE6" : "none" }}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px]" style={{ background: "#F5F4EF" }}>{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[10.5px] font-semibold text-[#1a1a1a]">{name}</div>
                  <div className="text-[9px] text-[#aaa]" style={{ fontFamily: "var(--font-geist-mono)" }}>{desc}</div>
                </div>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-semibold" style={{ background: bg, color, fontFamily: "var(--font-geist-mono)" }}>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="absolute -bottom-4 -right-3 z-10 flex items-center gap-2.5 rounded-[14px] px-4 py-2.5 shadow-[0_18px_40px_rgba(17,17,17,0.16)]" style={{ background: "#BFEF38" }}>
      <span className="text-base">⚡</span>
      <div>
        <div className="text-[11px] font-bold text-[#111]">{t.landing.preview.highlightTitle}</div>
        <div className="text-[9px] text-[#555]" style={{ fontFamily: "var(--font-geist-mono)" }}>{t.landing.preview.highlightSubtitle}</div>
      </div>
    </div>
    </div>
  );
};
