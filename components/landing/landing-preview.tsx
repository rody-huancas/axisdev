const previewData = {
  userInitials: "JD",
  userName: "Juan D.",
  stats: [
    { val: "24", label: "Tareas pendientes", color: "#16a34a" },
    { val: "6", label: "Reuniones hoy", color: "#111" },
    { val: "138", label: "Emails sin leer", color: "#d97706" },
  ],
  services: [
    { icon: "📁", name: "Drive", dot: "#4285F4" },
    { icon: "📅", name: "Calendar", dot: "#EA4335" },
    { icon: "📧", name: "Gmail", dot: "#EA4335" },
    { icon: "✅", name: "Tasks", dot: "#34A853" },
    { icon: "☁️", name: "Storage", dot: "#FBBC05" },
    { icon: "👥", name: "Contacts", dot: "#4285F4" },
  ],
  recentActivity: [
    { icon: "📄", name: "Propuesta Q2.docx", desc: "Editado en Drive", time: "2m", bg: "#4285F418", color: "#4285F4" },
    { icon: "📅", name: "Reunión de equipo", desc: "Hoy a las 3:00 PM", time: "1h", bg: "#EA443518", color: "#EA4335" },
    { icon: "📧", name: "Mensaje de Carlos", desc: "Re: Entregables del sprint", time: "3h", bg: "#34A85318", color: "#34A853" },
  ],
};

export const LandingPreview = () => (
  <div className="relative hidden lg:flex justify-center items-center">
    <div className="w-full max-w-105 overflow-hidden rounded-[18px] border border-[#DDDBD3] bg-white">
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
            Dashboard
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
            Servicios conectados
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {previewData.services.map(({ icon, name, dot }) => (
              <div key={name} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2" style={{ background: "#F5F4EF" }}>
                <span className="text-[13px] shrink-0">{icon}</span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[10px] font-semibold text-[#222]">{name}</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.25 w-1.25 shrink-0 rounded-full" style={{ background: dot }} />
                    <span className="text-[7.5px] text-[#bbb]" style={{ fontFamily: "var(--font-geist-mono)" }}>conectado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[8px] uppercase tracking-[0.18em] text-[#bbb] font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>
            Actividad reciente
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

    <div className="absolute -bottom-4 -right-3 z-10 flex items-center gap-2.5 rounded-[14px] px-4 py-2.5" style={{ background: "#BFEF38" }}>
      <span className="text-base">⚡</span>
      <div>
        <div className="text-[11px] font-bold text-[#111]">Todo en un lugar</div>
        <div className="text-[9px] text-[#555]" style={{ fontFamily: "var(--font-geist-mono)" }}>6 servicios conectados</div>
      </div>
    </div>
  </div>
);
