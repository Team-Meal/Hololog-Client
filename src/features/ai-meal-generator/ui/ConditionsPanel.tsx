"use client";

import { useState } from "react";
import { PlusIcon, SlidersIcon, SparklesIcon, SurfaceCard, XIcon } from "@/shared/ui";
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
    addIngredient,
    removeIngredient,
    addNutrition,
    removeNutrition,
  } = useGeneratorStore();

  const [ingInput, setIngInput] = useState("");

  const NUTRITION_OPTIONS = [
    "고단백",
    "저지방",
    "저나트륨",
    "저탄수화물",
    "고식이섬유",
    "칼슘 강화",
    "철분 강화",
    "비타민 풍부",
    "항산화",
    "오메가-3",
    "저당",
    "균형 영양",
  ];

  function handleAddIngredient() {
    const trimmed = ingInput.trim();
    if (!trimmed) return;
    addIngredient(trimmed);
    setIngInput("");
  }

  function handleToggleNutrition(label: string) {
    const existing = conditions.nutritionCriteria.find((nc) => nc.label === label);
    if (existing) {
      removeNutrition(existing.id);
    } else {
      addNutrition(label);
    }
  }

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
            <div className="flex gap-2">
              <input
                type="text"
                value={ingInput}
                onChange={(e) => setIngInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                placeholder="재료 입력 후 Enter"
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                <PlusIcon size={12} />
                추가
              </button>
            </div>
            {conditions.seasonalIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {conditions.seasonalIngredients.map((ing) => (
                  <span
                    key={ing.id}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                  >
                    {ing.label}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing.id)}
                      className="ml-0.5 text-blue-400 hover:text-blue-700"
                    >
                      <XIcon size={10} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-800">영양 기준</p>
            <div className="flex flex-wrap gap-1.5">
              {NUTRITION_OPTIONS.map((option) => {
                const selected = conditions.nutritionCriteria.some((nc) => nc.label === option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleToggleNutrition(option)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      selected
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
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
