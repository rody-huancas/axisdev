"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DriveBreakdownItem = {
  label: string;
  value: number;
};

type DriveBreakdownChartProps = {
  items: DriveBreakdownItem[];
};

const palette = [
  "var(--axis-accent)",
  "var(--axis-accent-2)",
  "#34d399",
  "#f59e0b",
];

export const DriveBreakdownChart = ({ items }: DriveBreakdownChartProps) => {
  const hasData = items.some((item) => item.value > 0);

  return (
    <div className="h-44">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "var(--axis-surface)",
                borderRadius: 16,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--axis-muted)" }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Pie
              data={items}
              dataKey="value"
              nameKey="label"
              innerRadius={44}
              outerRadius={70}
              paddingAngle={3}
              stroke="rgba(148,163,184,0.18)"
            >
              {items.map((_, index) => (
                <Cell key={index} fill={palette[index % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong)">
          <p className="text-sm text-(--axis-muted)">Sin datos para graficar.</p>
        </div>
      )}
    </div>
  );
};
