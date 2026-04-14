const tags = ["Sincronización en tiempo real", "Visibilidad total", "Control centralizado"];

export const LandingTags = () => (
  <div className="flex flex-wrap gap-2">
    {tags.map((item) => (
      <span key={item} className="flex items-center gap-1.5 rounded-full border border-[#DDDBD3] bg-white px-3.5 py-1.5 text-[11px] text-[#555]">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "#111", fontSize: 7, fontWeight: 800 }}>
          ✓
        </span>
        {item}
      </span>
    ))}
  </div>
);
