export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="hud-label">{"// "}{eyebrow}</p> : null}
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
    </header>
  );
}
