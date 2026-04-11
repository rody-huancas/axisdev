"use client";

import { Bar, BarChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";

type LearningChartsProps = {
  progress  : number;
  weeklyBars: number[];
};

export const LearningCharts = ({ progress, weeklyBars }: LearningChartsProps) => {
  const radialData = [{ name: "Progreso", value: progress, fill: "var(--axis-accent)" }];
  const barData    = weeklyBars.map((value, index) => ({
    name: `Dia ${index + 1}`,
    value,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-[150px_1fr]">
      <div className="flex items-center justify-center">
        <div className="relative h-32 w-32">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="72%"
              outerRadius="100%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-(--axis-text)">{progress}%</span>
            <span className="text-[10px] text-(--axis-muted)">Completado</span>
          </div>
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barSize={12}>
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
              contentStyle={{
                background: "var(--axis-surface)",
                borderRadius: 12,
                border: "1px solid rgba(148, 163, 184, 0.3)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--axis-muted)" }}
              formatter={(value: number) => [`${value}`, "Eventos"]}
            />
            <Bar dataKey="value" radius={[12, 12, 12, 12]} fill="var(--axis-accent-2)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
