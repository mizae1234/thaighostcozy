'use client';

const CONFIG_BY_TYPE: Record<'hunger' | 'thirst', { icon: string; label: string; barClass: string }> = {
  hunger: { icon: '🍖', label: 'Hunger', barClass: 'bg-orange-400' },
  thirst: { icon: '💧', label: 'Thirst', barClass: 'bg-sky-400' },
};

export default function StatBar({ type, value }: { type: 'hunger' | 'thirst'; value: number }) {
  const { icon, label, barClass } = CONFIG_BY_TYPE[type];
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg leading-none">{icon}</span>
      <div className="w-32">
        <div className="mb-0.5 flex justify-between text-[10px] font-semibold text-white/80">
          <span>{label}</span>
          <span>{Math.round(pct)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-full rounded-full ${barClass} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
