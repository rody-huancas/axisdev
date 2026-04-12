"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type TaskStatusChartProps = {
  pending: number;
  completed: number;
};

export const TaskStatusChart = ({ pending, completed }: TaskStatusChartProps) => {
  const total = pending + completed;
  const data = [
    { label: "Pendiente", value: pending },
    { label: "Completada", value: completed },
  ];

  return (
    <div className="h-44">
      {total ? (
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
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={44}
              outerRadius={70}
              paddingAngle={3}
              stroke="rgba(148,163,184,0.18)"
            >
              <Cell fill="#f59e0b" />
              <Cell fill="#34d399" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong)">
          <p className="text-sm text-(--axis-muted)">Sin tareas para graficar.</p>
        </div>
      )}
    </div>
  );
};
