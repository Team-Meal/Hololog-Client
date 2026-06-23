"use client";

import { useEffect, useState } from "react";
import {
  executionPercent,
  getBudgets,
  selectActiveBudget,
  type Budget,
} from "@/entities/budget";
import { StatusBadge, SurfaceCard } from "@/shared/ui";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BudgetSummary() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getBudgets()
      .then((data) => {
        if (alive) setBudget(selectActiveBudget(data));
      })
      .catch(() => {
        if (alive) setBudget(null);
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded) {
    return (
      <SurfaceCard>
        <div className="h-40 animate-pulse rounded-xl bg-zinc-100" />
      </SurfaceCard>
    );
  }

  if (!budget) {
    return (
      <SurfaceCard>
        <p className="text-sm font-semibold text-zinc-950">예산</p>
        <p className="mt-8 text-center text-sm text-zinc-400">등록된 예산이 없습니다.</p>
      </SurfaceCard>
    );
  }

  const pct = executionPercent(budget.usedAmount, budget.totalAmount);
  const usedLen = (Math.min(pct, 100) / 100) * CIRCUMFERENCE;
  const remaining = Math.max(budget.totalAmount - budget.usedAmount, 0);

  return (
    <SurfaceCard>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-zinc-950">{budget.title}</p>
        <StatusBadge tone="blue">{pct}% 집행</StatusBadge>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="relative size-32 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={`${usedLen} ${CIRCUMFERENCE - usedLen}`}
              strokeLinecap="butt"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold tracking-tight text-zinc-950">{pct}%</span>
            <span className="text-[11px] text-zinc-400">집행</span>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5">
          <li className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600">
              <span className="size-2.5 rounded-full bg-blue-500" />
              집행액
            </span>
            <span className="font-semibold text-zinc-950">
              ₩{budget.usedAmount.toLocaleString()}
            </span>
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600">
              <span className="size-2.5 rounded-full bg-zinc-300" />
              잔여
            </span>
            <span className="font-semibold text-zinc-950">₩{remaining.toLocaleString()}</span>
          </li>
        </ul>
      </div>
    </SurfaceCard>
  );
}
