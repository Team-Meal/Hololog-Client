import { PencilIcon, SectionTitle } from "@/shared/ui";

interface ProfilePanelProps {
  name: string;
  roleText: string;
  schoolName: string;
  loading?: boolean;
  // When provided, renders a "수정하기" button that triggers school-name editing.
  onEdit?: () => void;
}

export function ProfilePanel({
  name,
  roleText,
  schoolName,
  loading = false,
  onEdit,
}: ProfilePanelProps) {
  const initial = name.charAt(0) || "?";

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="프로필"
        description="이름, 권한, 소속 학교를 확인하세요."
        action={
          onEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={loading}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <PencilIcon className="size-4" aria-hidden="true" />
              수정하기
            </button>
          )
        }
      />

      {loading ? (
        <div className="h-16 animate-pulse rounded-2xl bg-zinc-100" />
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-zinc-950">
              {name} {roleText}
            </p>
            <p className="mt-0.5 text-sm text-zinc-500">{schoolName}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField label="이름" value={name} loading={loading} />
        <ReadOnlyField label="직책" value={roleText} loading={loading} />
        <ReadOnlyField label="소속 학교" value={schoolName} loading={loading} />
      </div>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-semibold text-zinc-600">{label}</span>
      {loading ? (
        <div className="h-10 animate-pulse rounded-xl bg-zinc-100" />
      ) : (
        <p className="flex h-10 items-center rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800">
          {value || "-"}
        </p>
      )}
    </div>
  );
}
