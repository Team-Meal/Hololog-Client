"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Segment {
  label: string;
  value: number;
  color?: string;
}

interface Ring {
  name: string;
  data: Segment[];
}

interface NxDonutMultiProps {
  rings?: Ring[];
  size?: number;
}

const DEFAULT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const DUMMY: Ring[] = [
  {
    name: "단백질",
    data: [
      { label: "섭취", value: 72 },
      { label: "목표 잔량", value: 28, color: "#F3F4F6" },
    ],
  },
  {
    name: "탄수화물",
    data: [
      { label: "섭취", value: 55 },
      { label: "목표 잔량", value: 45, color: "#F3F4F6" },
    ],
  },
  {
    name: "지방",
    data: [
      { label: "섭취", value: 88 },
      { label: "목표 잔량", value: 12, color: "#F3F4F6" },
    ],
  },
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
      <p className="text-sm font-semibold text-zinc-800">{value}%</p>
    </div>
  );
}

export function NxDonutMulti({ rings = DUMMY, size = 200 }: NxDonutMultiProps) {
  const ringCount = rings.length;
  const gap = 10;
  const minInner = size * 0.08;
  const totalTrack = size / 2 - 8 - minInner - gap * (ringCount - 1);
  const trackWidth = totalTrack / ringCount;

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {rings.map((ring, ringIdx) => {
            const outerR = size / 2 - 8 - ringIdx * (trackWidth + gap);
            const innerR = outerR - trackWidth;
            return (
              <Pie
                key={ring.name}
                data={ring.data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={innerR}
                outerRadius={outerR}
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                {ring.data.map((seg, segIdx) => (
                  <Cell
                    key={seg.label}
                    fill={
                      seg.color ??
                      (segIdx === 0 ? DEFAULT_COLORS[ringIdx % DEFAULT_COLORS.length] : "#F3F4F6")
                    }
                  />
                ))}
              </Pie>
            );
          })}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
