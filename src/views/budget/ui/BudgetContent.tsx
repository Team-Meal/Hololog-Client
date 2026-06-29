"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BudgetKpiCards,
  ExecutionDonut,
  deleteBudget,
  executionPercent,
  getBudgets,
  selectActiveBudget,
  type Budget,
} from "@/entities/budget";
import { Button, ConfirmDialog, PencilIcon, PlusIcon, SurfaceCard, TrashIcon } from "@/shared/ui";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { EditBudgetDialog } from "./EditBudgetDialog";

function formatPeriod(budget: Budget): string {
  const toDots = (date: string) => date.replaceAll("-", ".");
  return `${toDots(budget.startDate)} ~ ${toDots(budget.endDate)}`;
}

type LoadError = "forbidden" | "unauthorized" | "generic";

function toLoadError(err: unknown): LoadError {
  const status =
    typeof err === "object" && err !== null && "response" in err
      ? (err as { response?: { status?: number } }).response?.status
      : undefined;
  if (status === 403) return "forbidden";
  if (status === 401) return "unauthorized";
  return "generic";
}

export function BudgetContent() {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [error, setError] = useState<LoadError | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(() => {
    getBudgets()
      .then((data) => {
        setBudgets(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(toLoadError(err));
        setBudgets([]);
      });
  }, []);

  useEffect(() => {
    let alive = true;
    getBudgets()
      .then((data) => {
        if (alive) {
          setBudgets(data);
          setError(null);
          const auto = selectActiveBudget(data);
          if (auto) setSelectedId(auto.id);
        }
      })
      .catch((err: unknown) => {
        if (alive) {
          setError(toLoadError(err));
          setBudgets([]);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!deletingBudget) return;
    setDeleting(true);
    try {
      await deleteBudget(deletingBudget.id);
      if (selectedId === deletingBudget.id) setSelectedId(null);
      setDeletingBudget(null);
      reload();
    } catch {
      toast.error("예산 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (budgets === null) {
    return <div className="h-64 animate-pulse rounded-2xl bg-zinc-100" />;
  }

  if (error === "forbidden") {
    return (
      <Notice
        title="예산을 볼 수 있는 권한이 없습니다"
        text="예산 현황은 승인된 영양사 계정만 확인할 수 있습니다. 계정이 아직 승인 대기 중이라면 승인 완료 후 다시 시도해 주세요."
      />
    );
  }

  if (error === "unauthorized") {
    return (
      <Notice
        title="로그인이 필요합니다"
        text="세션이 만료되었어요. 다시 로그인한 뒤 이용해 주세요."
      />
    );
  }

  if (error === "generic") {
    return <Notice text="예산 정보를 불러오지 못했습니다." />;
  }

  const dateActiveId = budgets.length > 0 ? (selectActiveBudget(budgets)?.id ?? null) : null;
  const effectiveId = selectedId ?? dateActiveId;
  const active = budgets.find((b) => b.id === effectiveId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <PlusIcon size={16} />
          예산 입력
        </Button>
      </div>

      {active ? (
        <>
          <BudgetKpiCards
            total={active.totalAmount}
            spent={active.usedAmount}
            period={formatPeriod(active)}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BudgetList
                budgets={budgets}
                dateActiveId={dateActiveId}
                selectedId={effectiveId}
                onSelect={setSelectedId}
                onEdit={setEditingBudget}
                onDelete={setDeletingBudget}
              />
            </div>
            <ExecutionDonut used={active.usedAmount} total={active.totalAmount} />
          </div>
        </>
      ) : (
        <Notice text="등록된 예산이 없습니다. 예산을 입력해 주세요." />
      )}

      <CreateBudgetDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          reload();
        }}
      />

      {editingBudget && (
        <EditBudgetDialog
          key={editingBudget.id}
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onUpdated={() => {
            setEditingBudget(null);
            reload();
          }}
        />
      )}

      <ConfirmDialog
        open={deletingBudget !== null}
        title="예산을 삭제할까요?"
        description={deletingBudget ? `"${deletingBudget.title}" 예산이 영구적으로 삭제됩니다.` : undefined}
        confirmText="삭제"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => !deleting && setDeletingBudget(null)}
      />
    </div>
  );
}

type BudgetListProps = {
  budgets: Budget[];
  dateActiveId: number | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
};

function BudgetList({ budgets, dateActiveId, selectedId, onSelect, onEdit, onDelete }: BudgetListProps) {
  return (
    <SurfaceCard>
      <h2 className="text-base font-semibold text-zinc-900">예산 목록</h2>
      <ul className="mt-4 flex flex-col divide-y divide-zinc-100">
        {budgets.map((budget) => {
          const pct = executionPercent(budget.usedAmount, budget.totalAmount);
          const isSelected = budget.id === selectedId;
          const isDateActive = budget.id === dateActiveId;

          return (
            <li
              key={budget.id}
              className={[
                "flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0",
                "-mx-2 cursor-pointer rounded-lg px-2 transition-colors",
                isSelected ? "bg-blue-50" : "hover:bg-zinc-50",
              ].join(" ")}
              onClick={() => onSelect(budget.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 truncate text-sm font-medium text-zinc-900">
                  {budget.title}
                  {isDateActive && (
                    <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600">
                      진행 중
                    </span>
                  )}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-xs text-zinc-400">{formatPeriod(budget)}</span>
                  <button
                    type="button"
                    aria-label="예산 수정"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(budget);
                    }}
                    className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="예산 삭제"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(budget);
                    }}
                    className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-medium text-zinc-500">
                  ₩{budget.usedAmount.toLocaleString()} / ₩{budget.totalAmount.toLocaleString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}

function Notice({ title, text }: { title?: string; text: string }) {
  return (
    <SurfaceCard>
      <div className="flex flex-col items-center gap-1.5 py-10 text-center">
        {title && <p className="text-sm font-semibold text-zinc-700">{title}</p>}
        <p className="text-sm text-zinc-400">{text}</p>
      </div>
    </SurfaceCard>
  );
}
