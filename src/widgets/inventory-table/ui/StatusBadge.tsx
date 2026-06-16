import type { IngredientStatus } from "@/entities/ingredient";

interface StatusBadgeProps {
  status: IngredientStatus;
}

const STATUS_STYLES: Record<IngredientStatus, string> = {
  정상: "bg-green-50 text-green-600",
  부족: "bg-amber-50 text-amber-600",
  긴급: "bg-red-50 text-red-600",
  임박: "bg-violet-50 text-violet-600",
};

const STATUS_DOT: Record<IngredientStatus, string> = {
  정상: "bg-green-500",
  부족: "bg-amber-500",
  긴급: "bg-red-500",
  임박: "bg-violet-500",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}
