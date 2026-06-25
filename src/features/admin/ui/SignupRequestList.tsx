"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/ui";
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
      {/* 대기 건수 */}
      {!isLoading && !error && (
        <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#f5a623]">
          대기 중 {pendingRequests.length}건
        </p>
      )}

      {/* 목록 */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-[#ebebeb] bg-white py-16">
            <span className="text-sm text-[#8f8f8f]">불러오는 중…</span>
          </div>

        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-[#ebebeb] bg-white py-16">
            <span className="text-sm text-[#4d4d4d]">{error}</span>
            <button
              type="button"
              onClick={() => fetchRequests(page)}
              className="flex h-8 items-center rounded-md border border-[#ebebeb] bg-white px-3 text-sm font-medium text-[#171717] hover:border-[#d5d5d5] hover:bg-[#f2f2f2]"
            >
              다시 시도
            </button>
          </div>

        ) : pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#ebebeb] bg-white py-16">
            <p className="text-sm font-medium text-[#171717]">처리 대기 중인 요청이 없습니다</p>
            <p className="text-xs text-[#8f8f8f]">모든 가입 요청이 처리되었습니다.</p>
          </div>

        ) : (
          pendingRequests.map((item) => (
            <div
              key={item.requestId}
              className="flex items-center gap-4 rounded-xl border border-[#ebebeb] bg-white px-6 py-4"
              style={{ boxShadow: "0px 1px 1px rgba(0,0,0,0.04)" }}
            >
              {/* 이니셜 아바타 */}
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#171717] text-[13px] font-semibold text-white">
                {item.name.charAt(0)}
              </div>

              {/* 이름 + 면허번호 */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium tracking-[-0.01em] text-[#171717]">
                  {item.name}
                </p>
                <p
                  className="mt-0.5 font-mono text-xs text-[#8f8f8f]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.licenseNumber}
                </p>
              </div>

              {/* 상태 */}
              <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#f5a623]">
                대기 중
              </span>

              {/* 액션 버튼 */}
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setPendingAction({ type: "approve", item })}
                  className="flex h-8 items-center rounded-md bg-[#0070f3] px-3 text-sm font-medium text-white transition-colors hover:bg-[#0761d1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  승인
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setPendingAction({ type: "reject", item })}
                  className="flex h-8 items-center rounded-md border border-[#ebebeb] bg-white px-3 text-sm font-medium text-[#ee0000] transition-colors hover:border-[#ee0000]/30 hover:bg-[#ee0000]/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  거절
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-[#ebebeb] pt-4">
          <span className="font-mono text-xs text-[#8f8f8f]">
            {page + 1} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0 || isLoading}
              onClick={() => fetchRequests(page - 1)}
              className="flex h-8 items-center rounded-md border border-[#ebebeb] bg-white px-3 text-sm font-medium text-[#171717] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            <button
              type="button"
              disabled={page + 1 >= totalPages || isLoading}
              onClick={() => fetchRequests(page + 1)}
              className="flex h-8 items-center rounded-md border border-[#ebebeb] bg-white px-3 text-sm font-medium text-[#171717] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      )}

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
