"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface NxColumnsProps {
  data?: DataPoint[];
  color?: string;
  unit?: string;
  height?: number;
}

const DUMMY: DataPoint[] = [
  { label: "월", value: 1850 },
  { label: "화", value: 2100 },
  { label: "수", value: 1640 },
  { label: "목", value: 2280 },
  { label: "금", value: 1970 },
  { label: "토", value: 2450 },
  { label: "일", value: 1320 },
];

interface TooltipEntry {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipEntry) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-(--shadow-card)">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-zinc-800">{payload[0].value}</p>
    </div>
  );
}

export function NxColumns({ data = DUMMY, color = "#3B82F6", unit, height = 240 }: NxColumnsProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        barCategoryGap="35%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          unit={unit}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={`col-${i}`} fill={entry.color ?? color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
