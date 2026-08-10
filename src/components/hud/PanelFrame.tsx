'use client';

export default function PanelFrame({
  children,
  className = '',
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-slate-900/80 p-3 shadow-lg backdrop-blur-sm ${className}`}
    >
      {title && (
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-emerald-300/90">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
