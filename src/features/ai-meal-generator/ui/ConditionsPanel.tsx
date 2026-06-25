"use client";

import { CheckIcon, SlidersIcon, SparklesIcon, SurfaceCard } from "@/shared/ui";
import { useGeneratorStore } from "../model/generator.store";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
        value ? "bg-green-500" : "bg-zinc-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function RangeSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
      style={{
        background: `linear-gradient(to right, #2563eb ${pct}%, #e4e7ec ${pct}%)`,
      }}
    />
  );
}

export function ConditionsPanel() {
  const {
    status,
    conditions,
    generate,
    setUseInventory,
    setBudgetPerPerson,
    setPreferenceWeight,
    toggleIngredient,
    toggleNutrition,
  } = useGeneratorStore();

  const isLoading = status === "loading";
  const isDone = status === "done";

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <SurfaceCard>
        <div className="mb-4 flex items-center gap-2">
          <SlidersIcon size={15} className="text-blue-600" />
          <p className="text-sm font-semibold text-zinc-800">생성 조건</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-800">가용 재고 반영</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                현재 재고 16종을 우선 활용해 폐기를 줄여요.
              </p>
            </div>
            <Toggle value={conditions.useInventory} onChange={setUseInventory} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-800">1인분 예산</p>
              <p className="text-sm font-bold text-zinc-900">
                ₩{conditions.budgetPerPerson.toLocaleString()}
              </p>
            </div>
            <RangeSlider
              value={conditions.budgetPerPerson}
              min={800}
              max={3000}
              step={100}
              onChange={setBudgetPerPerson}
            />
            <p className="text-xs text-zinc-400">월 예산 ₩7,200만 기준 권장 범위 내</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-800">학생 선호도 반영</p>
              <p className="text-sm font-bold text-zinc-900">{conditions.preferenceWeight}%</p>
            </div>
            <RangeSlider
              value={conditions.preferenceWeight}
              min={0}
              max={100}
              onChange={setPreferenceWeight}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-800">제철 식자재</p>
            <div className="flex flex-wrap gap-2">
              {conditions.seasonalIngredients.map((ing) => (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => toggleIngredient(ing.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                    ing.selected
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                  }`}
                >
                  {ing.selected && <CheckIcon size={10} strokeWidth={2.5} />}
                  {ing.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-800">영양 기준</p>
            <div className="flex flex-col gap-2">
              {conditions.nutritionCriteria.map((nc) => (
                <button
                  key={nc.id}
                  type="button"
                  onClick={() => toggleNutrition(nc.id)}
                  className="flex items-center gap-2.5 text-left"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      nc.checked ? "border-blue-600 bg-blue-600" : "border-zinc-300 bg-white"
                    }`}
                  >
                    {nc.checked && <CheckIcon size={10} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className="text-sm text-zinc-700">{nc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SurfaceCard>

      <button
        type="button"
        onClick={() => void generate()}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <SparklesIcon size={14} />
        {isLoading ? "생성 중..." : isDone ? "다시 생성하기" : "식단 생성하기"}
      </button>
    </div>
  );
}
