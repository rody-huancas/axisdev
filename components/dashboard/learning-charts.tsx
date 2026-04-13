"use client";

import { Bar, BarChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts";
import { useThemeStore } from "@/lib/store/theme";

type LearningChartsProps = {
  progress: number;
  weeklyBars: number[];
};

export const LearningCharts = ({ progress, weeklyBars }: LearningChartsProps) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  const radialData = [{ name: "Progreso", value: progress }];
  const barData = weeklyBars.map((value, index) => ({
    name: `Dia ${index + 1}`,
    value,
  }));

  const hasData = weeklyBars.some((v) => v > 0);

  const accentColor = isDark ? "#8b5cf6" : "#6c63ff";
  const accent2Color = isDark ? "#38bdf8" : "#60a5fa";
  const barBg = isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(96, 165, 250, 0.2)";

  return (
    <div className="grid gap-6 md:grid-cols-[140px_1fr]">
      <div className="flex items-center justify-center">
        <div className="relative h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={8}
                background={{ fill: isDark ? "#1a1c25" : "#e2e8f0", opacity: 0.5 }}
                fill={accentColor}
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
            <BarChart data={barData} barSize={18}>
              <Tooltip
                cursor={{ fill: isDark ? "#1a1c25" : "#e2e8f0" }}
                contentStyle={{
                  background: isDark ? "#212332" : "#ffffff",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(15, 23, 42, 0.1)",
                  fontSize: 12,
                }}
                labelStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
                formatter={(value: number) => [`${value}`, "Eventos"]}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 8, 8]}
                fill={accent2Color}
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