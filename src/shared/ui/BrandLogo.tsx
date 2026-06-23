import { HomeIcon } from "./icons";

type BrandLogoProps = {
  compact?: boolean;
  dark?: boolean;
};

export function BrandLogo({ compact = false, dark = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
        <HomeIcon size={18} strokeWidth={2.1} />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p
            className={[
              "text-base leading-5 font-bold",
              dark ? "text-white" : "text-zinc-950",
            ].join(" ")}
          >
            Hololog
          </p>
          <p
            className={["text-xs font-medium", dark ? "text-white/45" : "text-zinc-400"].join(" ")}
          >
            School meal ops
          </p>
        </div>
      )}
    </div>
  );
}
