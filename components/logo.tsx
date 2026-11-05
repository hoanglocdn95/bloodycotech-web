import { cx } from "@/lib/cx";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("logo-lockup inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0">
        <path d="M2 2h28v24h-4v4H6v-4H2z" className="fill-accent" />
        <path
          d="M13 9 8 16l5 7M19 9l5 7-5 7"
          fill="none"
          stroke="var(--on-accent)"
          strokeWidth="2.4"
        />
      </svg>
      <span className="font-display text-lg">BloodyCoTech</span>
    </span>
  );
}
