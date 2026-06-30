"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  addMonths,
  buildMonthGrid,
  currentMonth,
  deleteDiet,
  getDiet,
  getDiets,
  monthKey,
  monthLabel,
} from "@/entities/meal";
import type { Diet, DietListItem, MonthRef } from "@/entities/meal";
import {
  Button,
  ChevronDownIcon,
  ConfirmDialog,
  PencilIcon,
  RecycleIcon,
  TrashIcon,
} from "@/shared/ui";
import { useMealCalendarStore } from "../model/meal-calendar.store";
import { DietFormDialog } from "./DietFormDialog";
import { LeftoverDialog } from "./LeftoverDialog";
import { MealMonthGrid } from "./MealMonthGrid";

export function MealCalendar() {
  const { selectedDietId, setSelectedDietId, reloadToken, bumpReload } = useMealCalendarStore();
  const [diets, setDiets] = useState<DietListItem[]>([]);
  const [detailById, setDetailById] = useState<Map<number, Diet>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState<Diet | null>(null);
  // Cache fetched details so re-selecting a diet shows instantly (no refetch flash).
  const detailCache = useRef<Map<number, Diet>>(new Map());

  // Month the grid is showing. Defaults to the current month.
  const [viewMonth, setViewMonth] = useState<MonthRef>(() => currentMonth());

  const [editOpen, setEditOpen] = useState(false);
  const [leftoverOpen, setLeftoverOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // Date the user clicked "+" on; opens the create dialog pre-filled with it.
  const [addDate, setAddDate] = useState<string | null>(null);

  const weeks = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  // Index diets by date for O(1) cell lookup.
  const dietsByDate = useMemo(() => {
    const map = new Map<string, DietListItem[]>();
    for (const diet of diets) {
      const list = map.get(diet.dietDate) ?? [];
      list.push(diet);
      map.set(diet.dietDate, list);
    }
    return map;
  }, [diets]);

  // How many diets fall inside the visible month (for the header count).
  const monthCount = useMemo(() => {
    const prefix = monthKey(viewMonth);
    return diets.filter((d) => d.dietDate.startsWith(prefix)).length;
  }, [diets, viewMonth]);

  // The list item already carries name/date, so render the panel header from it
  // immediately — only the description waits on the single-diet fetch. This avoids
  // flashing a full-block skeleton on every selection.
  const selectedListItem =
    selectedDietId === null ? null : (diets.find((d) => d.id === selectedDietId) ?? null);
  const loadedDetail = detail && detail.id === selectedDietId ? detail : null;

  const handleDelete = async () => {
    if (selectedDietId === null) return;
    setDeleting(true);
    try {
      await deleteDiet(selectedDietId);
      toast.success("식단이 삭제되었습니다.");
      setDeleteOpen(false);
      setSelectedDietId(null);
      bumpReload();
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error("식단 삭제에 실패했습니다.", { description: message });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    let active = true;
    // A diet's detail can change after edits; drop the stale cache so the
    // in-flight refetch below repopulates it fresh.
    detailCache.current.clear();
    getDiets()
      .then(async (list) => {
        if (active) {
          setDiets(list);
          setError(false);
        }

        const details = await Promise.allSettled(list.map((diet) => getDiet(diet.id)));
        if (!active) return;

        const nextDetailById = new Map<number, Diet>();
        for (const result of details) {
          if (result.status === "fulfilled") {
            nextDetailById.set(result.value.id, result.value);
          }
        }

        detailCache.current = nextDetailById;
        setDetailById(nextDetailById);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadToken]);

  // Load the single-diet detail (includes description) when one is selected.
  useEffect(() => {
    if (selectedDietId === null) return;

    // Serve from cache instantly — no fetch, no flash.
    const cached = detailById.get(selectedDietId) ?? detailCache.current.get(selectedDietId);
    if (cached) {
      setDetail(cached);
      return;
    }

    let active = true;
    getDiet(selectedDietId)
      .then((d) => {
        detailCache.current.set(d.id, d);
        if (active) setDetail(d);
      })
      .catch(() => {
        if (active) setDetail(null);
      });
    return () => {
      active = false;
    };
  }, [selectedDietId, reloadToken, detailById]);

  return (
    <div className="rounded-2xl bg-white shadow-(--shadow-card)">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <ChevronDownIcon size={16} className="rotate-90" />
          </button>
          <h2 className="min-w-24 text-center text-sm font-semibold text-zinc-800">
            {monthLabel(viewMonth)}
          </h2>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <ChevronDownIcon size={16} className="-rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth(currentMonth())}
            className="ml-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50"
          >
            오늘
          </button>
        </div>
        <span className="text-sm text-zinc-400">
          {loading ? "불러오는 중…" : `이번 달 ${monthCount}건`}
        </span>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-400">
            식단을 불러오는 중입니다…
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-sm text-red-400">
            식단을 불러오지 못했습니다.
          </div>
        ) : (
          <>
            <MealMonthGrid
              weeks={weeks}
              dietsByDate={dietsByDate}
              detailById={detailById}
              selectedDietId={selectedDietId}
              onSelect={(id) => setSelectedDietId(id === selectedDietId ? null : id)}
              onAddDate={(date) => setAddDate(date)}
            />

            {selectedListItem && (
              <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-800">{selectedListItem.name}</span>
                  <span className="text-xs text-zinc-400">{selectedListItem.dietDate}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {loadedDetail ? loadedDetail.description || "상세 설명이 없습니다." : " "}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditOpen(true)}
                    disabled={!loadedDetail}
                  >
                    <PencilIcon size={14} />
                    수정
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setLeftoverOpen(true)}
                    disabled={!loadedDetail}
                  >
                    <RecycleIcon size={14} />
                    잔반량
                  </Button>
                  <Button variant="ghost" onClick={() => setDeleteOpen(true)}>
                    <TrashIcon size={14} />
                    삭제
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {addDate && (
        <DietFormDialog
          open
          defaultDate={addDate}
          onClose={() => setAddDate(null)}
          onSaved={() => {
            setAddDate(null);
            bumpReload();
          }}
        />
      )}

      {editOpen && detail && (
        <DietFormDialog
          open
          diet={detail}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            bumpReload();
          }}
        />
      )}

      {leftoverOpen && detail && (
        <LeftoverDialog
          open
          dietId={detail.id}
          dietName={detail.name}
          onClose={() => setLeftoverOpen(false)}
          onSaved={() => setLeftoverOpen(false)}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="식단을 삭제할까요?"
        description="삭제한 식단은 되돌릴 수 없습니다."
        confirmText="삭제"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
