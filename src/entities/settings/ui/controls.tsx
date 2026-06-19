import type { ReactNode } from "react";

/** 라벨이 붙은 텍스트 입력 필드. */
export function Field({
  label,
  value,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-zinc-600">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
      />
    </label>
  );
}

/** 설정 행들을 구분선과 함께 세로로 나열한다. */
export function RowList({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-zinc-100">{children}</div>;
}

/** 제목·설명과 우측 액션으로 구성된 설정 1행. */
export function SettingRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-950">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-400">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

/** on/off 스위치. */
export function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className={["relative h-6 w-11 rounded-full", enabled ? "bg-blue-600" : "bg-zinc-200"].join(
        " ",
      )}
    >
      <span
        className={[
          "absolute top-1 size-4 rounded-full bg-white shadow-sm",
          enabled ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}
