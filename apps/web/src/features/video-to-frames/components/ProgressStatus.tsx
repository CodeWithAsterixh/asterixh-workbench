interface ProgressStatusProps {
  label: string;
  completed: number;
  total: number;
}

export function ProgressStatus({ label, completed, total }: ProgressStatusProps) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div role="status" aria-live="polite">
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow">{label}</span>
        <span className="timecode">
          {completed} / {total}
        </span>
      </div>
      <div className="h-[3px] w-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
