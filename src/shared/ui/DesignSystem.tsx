import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "zinc";
};

const badgeTone = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  zinc: "bg-zinc-100 text-zinc-500",
};

export function PageShell({ eyebrow, title, description, actions, children }: PageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] animate-fade-in-up flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <section
      className={[
        "rounded-2xl bg-white p-5 shadow-(--shadow-card)",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function StatusBadge({ children, tone = "blue" }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        badgeTone[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
