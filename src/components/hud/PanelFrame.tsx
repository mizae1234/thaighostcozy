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
      className={`rounded-2xl border border-stone-200 bg-[#FCFBF9] p-3.5 shadow-md ${className}`}
    >
      {title && (
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#2D4B32] border-b border-stone-150 pb-1">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
