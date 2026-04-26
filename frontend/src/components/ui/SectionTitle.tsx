interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <header className="space-y-2">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span
          className="h-1.5 w-11 shrink-0 rounded-full bg-gradient-to-r from-zinc-400 to-zinc-600 shadow-sm"
          aria-hidden
        />
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle ? <p className="section-subtitle max-w-2xl">{subtitle}</p> : null}
    </header>
  );
}

export default SectionTitle;