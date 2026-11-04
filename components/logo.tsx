import { cx } from "@/lib/cx";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <path
          d="M13 10.5 8.5 16 13 21.5M19 10.5 23.5 16 19 21.5"
          fill="none"
          stroke="var(--on-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>BloodyCoTech</span>
    </span>
  );
}
