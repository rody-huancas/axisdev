type StorageSlice = {
  label: string;
  value: number;
  color: string;
};

type StorageChartProps = {
  total : string;
  used  : string;
  slices: StorageSlice[];
};

export const StorageChart = ({ total, used, slices }: StorageChartProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Detalles de almacenamiento</h3>
        <span className="text-xs text-white/40">
          {used} / {total}
        </span>
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-28 w-28">
          <div className="absolute inset-0 rounded-full border-8 border-white/10" />
          <div className="absolute inset-2.5 rounded-full border-8 border-(--axis-accent)/50" />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/70">
            {used}
          </div>
        </div>
        <div className="space-y-3 text-xs text-white/60">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }} />
                {slice.label}
              </span>
              <span>{slice.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
