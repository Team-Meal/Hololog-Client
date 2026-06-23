"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, ConfirmDialog, StatusBadge, SurfaceCard } from "@/shared/ui";
import { useAdminStore } from "../model/admin.store";
import type { SignupRequestItem } from "../model/types";

type PendingAction = { type: "approve" | "reject"; item: SignupRequestItem } | null;

export function SignupRequestList() {
  const { requests, page, totalPages, isLoading, actionLoading, error, fetchRequests, approve, reject } =
    useAdminStore();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    fetchRequests(0);
  }, [fetchRequests]);

  async function handleConfirm() {
    if (!pendingAction) return;
    const { type, item } = pendingAction;
    const ok = type === "approve" ? await approve(item.requestId) : await reject(item.requestId);
    setPendingAction(null);
    if (ok) {
      toast.success(type === "approve" ? "승인되었습니다." : "거절되었습니다.");
    } else {
      toast.error(useAdminStore.getState().error ?? "처리 중 오류가 발생했습니다.");
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  return (
    <>
      <SurfaceCard>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
              불러오는 중…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-16 text-sm text-zinc-500">
              <span>{error}</span>
              <Button size="sm" onClick={() => fetchRequests(page)}>
                다시 시도
              </Button>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
              처리 대기 중인 요청이 없습니다.
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-xs font-semibold text-zinc-400">
                  <th className="pb-3 pr-4">이름</th>
                  <th className="pb-3 pr-4">면허 번호</th>
                  <th className="pb-3 pr-4">상태</th>
                  <th className="pb-3 text-right">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {pendingRequests.map((item) => (
                  <tr key={item.requestId}>
                    <td className="py-3 pr-4 font-medium text-zinc-900">{item.name}</td>
                    <td className="py-3 pr-4 font-mono text-zinc-600">{item.licenseNumber}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge tone="amber">대기 중</StatusBadge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={actionLoading}
                          onClick={() => setPendingAction({ type: "approve", item })}
                        >
                          승인
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionLoading}
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setPendingAction({ type: "reject", item })}
                        >
                          거절
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
            <span className="text-zinc-400">
              {page + 1} / {totalPages} 페이지
            </span>
            <div className="flex gap-2">
              <Button size="sm" disabled={page === 0 || isLoading} onClick={() => fetchRequests(page - 1)}>
                이전
              </Button>
              <Button
                size="sm"
                disabled={page + 1 >= totalPages || isLoading}
                onClick={() => fetchRequests(page + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </SurfaceCard>

      <ConfirmDialog
        open={pendingAction !== null}
        title={
          pendingAction?.type === "approve"
            ? `${pendingAction.item.name} 영양사를 승인하시겠습니까?`
            : `${pendingAction?.item.name} 영양사의 요청을 거절하시겠습니까?`
        }
        description={
          pendingAction?.type === "approve"
            ? "승인 시 해당 회원의 역할이 영양사로 변경됩니다."
            : "거절된 요청은 되돌릴 수 없습니다."
        }
        confirmText={pendingAction?.type === "approve" ? "승인" : "거절"}
        tone={pendingAction?.type === "reject" ? "danger" : "default"}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onClose={() => setPendingAction(null)}
      />
    </>
  );
}
