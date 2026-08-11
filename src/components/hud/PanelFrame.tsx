'use client';

export default function PanelFrame({
  children,
  className = '',
  title,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-[#FCFBF9] p-3.5 shadow-md relative ${className}`}
    >
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-2 right-2 text-stone-400 hover:text-stone-650 font-bold text-xs p-1 select-none pointer-events-auto"
        >
          ✕
        </button>
      )}
      {title && (
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#2D4B32] border-b border-stone-150 pb-1 pr-6">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
