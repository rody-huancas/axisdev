"use client";

import { Bar, BarChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

type LearningChartsProps = {
  progress: number;
  weeklyBars: number[];
};

export const LearningCharts = ({ progress, weeklyBars }: LearningChartsProps) => {
  const radialData = [{ name: "Progreso", value: progress }];
  const barData = weeklyBars.map((value, index) => ({
    name: `Dia ${index + 1}`,
    value,
  }));

  const hasData = weeklyBars.some((v) => v > 0);

  return (
    <div className="grid gap-6 md:grid-cols-[140px_1fr]">
      <div className="flex items-center justify-center">
        <div className="relative h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={8}
                background={{ fill: "var(--axis-surface-strong)", opacity: 0.5 }}
                fill="var(--axis-accent)"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-(--axis-text)">{progress}</span>
            <span className="text-[9px] text-(--axis-muted)">%</span>
          </div>
        </div>
      </div>

      <div className="h-28">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={16}>
              <Tooltip
                cursor={{ fill: "var(--axis-surface-strong)" }}
                contentStyle={{
                  background: "var(--axis-surface)",
                  borderRadius: 12,
                  border: "1px solid var(--axis-border)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--axis-text)" }}
                formatter={(value: number) => [`${value}`, "Eventos"]}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 8, 8]}
                fill="var(--axis-accent-2)"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl bg-(--axis-surface-strong)">
            <p className="text-xs text-(--axis-muted)">Sin eventos</p>
          </div>
        )}
      </div>
    </div>
  );
};