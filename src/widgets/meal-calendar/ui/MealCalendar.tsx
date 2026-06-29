"use client";

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteDiet, getDiet, getDiets, groupDietsByDate } from "@/entities/meal";
import type { Diet, DietDateGroup } from "@/entities/meal";
import { Button, ConfirmDialog, PencilIcon, RecycleIcon, TrashIcon } from "@/shared/ui";
import { useMealCalendarStore } from "../model/meal-calendar.store";
import { DietFormDialog } from "./DietFormDialog";
import { LeftoverDialog } from "./LeftoverDialog";
import { MealDayCard } from "./MealDayCard";

export function MealCalendar() {
  const { selectedDietId, setSelectedDietId, reloadToken, bumpReload } = useMealCalendarStore();
  const [groups, setGroups] = useState<DietDateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState<Diet | null>(null);
  // Cache fetched details so re-selecting a diet shows instantly (no refetch flash).
  const detailCache = useRef<Map<number, Diet>>(new Map());

  const [editOpen, setEditOpen] = useState(false);
  const [leftoverOpen, setLeftoverOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // The list item already carries name/date, so render the panel header from it
  // immediately — only the description waits on the single-diet fetch. This avoids
  // flashing a full-block skeleton on every selection.
  const selectedListItem =
    selectedDietId === null
      ? null
      : (groups.flatMap((g) => g.diets).find((d) => d.id === selectedDietId) ?? null);
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
    getDiets()
      .then((diets) => {
        if (active) {
          setGroups(groupDietsByDate(diets));
          setError(false);
        }
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
    const cached = detailCache.current.get(selectedDietId);
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
  }, [selectedDietId, reloadToken]);

  // A diet's detail can change after edits; drop the cache so the next select refetches.
  useEffect(() => {
    detailCache.current.clear();
  }, [reloadToken]);

  return (
    <div className="rounded-2xl bg-white shadow-(--shadow-card)">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-zinc-800">식단 목록</h2>
        <span className="text-sm text-zinc-400">
          {loading ? "불러오는 중…" : `총 ${groups.reduce((n, g) => n + g.diets.length, 0)}건`}
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
        ) : groups.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-400">
            등록된 식단이 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {groups.map((group) => (
                <MealDayCard
                  key={group.date}
                  group={group}
                  selectedDietId={selectedDietId}
                  onSelect={(id) => setSelectedDietId(id === selectedDietId ? null : id)}
                />
              ))}
            </div>

            {selectedListItem && (
              <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-800">{selectedListItem.name}</span>
                  <span className="text-xs text-zinc-400">{selectedListItem.dietDate}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {loadedDetail ? loadedDetail.description || "상세 설명이 없습니다." : " "}
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
