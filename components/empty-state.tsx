export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pixel-card border-dashed px-6 py-8">
      <p className="text-lg font-semibold">{title}</p>
      <div className="mt-2 max-w-2xl leading-relaxed text-muted">{children}</div>
    </div>
  );
}
