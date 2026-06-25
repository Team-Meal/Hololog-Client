"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Segment {
  label: string;
  value: number;
  color?: string;
}

interface NxDonutProps {
  data?: Segment[];
  size?: number;
  innerRadiusRatio?: number;
  label?: string;
}

const DEFAULT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const DUMMY: Segment[] = [
  { label: "아침", value: 35 },
  { label: "점심", value: 40 },
  { label: "저녁", value: 25 },
];

interface TooltipEntry {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
}

function CustomTooltip({ active, payload }: TooltipEntry) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-(--shadow-card)">
      <p className="text-xs text-zinc-500">{name}</p>
      <p className="text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  );
}

export function NxDonut({ data = DUMMY, size = 200, innerRadiusRatio = 0.6, label }: NxDonutProps) {
  const outerRadius = size / 2 - 8;
  const innerRadius = outerRadius * innerRadiusRatio;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((seg, i) => (
              <Cell key={seg.label} fill={seg.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {label && (
        <span className="pointer-events-none absolute text-sm font-medium text-zinc-600">
          {label}
        </span>
      )}
    </div>
  );
}
