'use client';

const CONFIG_BY_TYPE: Record<'health' | 'hunger' | 'thirst', { icon: string; label: string; barClass: string }> = {
  health: { icon: '❤️', label: 'พลังชีวิต', barClass: 'bg-rose-500' },
  hunger: { icon: '🍖', label: 'ความหิว', barClass: 'bg-[#C96E3A]' },
  thirst: { icon: '💧', label: 'ความกระหาย', barClass: 'bg-sky-500' },
};

export default function StatBar({ type, value }: { type: 'health' | 'hunger' | 'thirst'; value: number }) {
  const { icon, label, barClass } = CONFIG_BY_TYPE[type];
  const pct = Math.max(0, Math.min(100, value));

  // Dynamic status visual styling
  let activeBarClass = barClass;
  let statusText = '';
  let labelColor = 'text-stone-600';

  if (type !== 'health') {
    if (pct <= 30) {
      activeBarClass = 'bg-rose-600 animate-pulse';
      statusText = '⚠️ วิกฤต!';
      labelColor = 'text-rose-600 font-extrabold';
    } else if (pct <= 50) {
      activeBarClass = 'bg-amber-500';
      statusText = '⏳ ใกล้หมด!';
      labelColor = 'text-amber-600 font-bold';
    }
  } else {
    // Health alerts
    if (pct <= 30) {
      activeBarClass = 'bg-red-700 animate-pulse';
      statusText = '🚨 บาดเจ็บ!';
      labelColor = 'text-red-700 font-black';
    } else if (pct <= 60) {
      activeBarClass = 'bg-rose-600';
      statusText = '⚠️ อ่อนแอ';
      labelColor = 'text-rose-600 font-bold';
    }
  }

  return (
    <div className="flex items-center gap-2.5 w-full">
      <span className="text-base leading-none select-none">{icon}</span>
      <div className="flex-grow">
        <div className="mb-0.5 flex justify-between text-[10px] font-bold text-stone-600">
          <span className="flex items-center gap-1.5">
            <span>{label}</span>
            {statusText && (
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-250 text-rose-700 animate-bounce select-none">
                {statusText}
              </span>
            )}
          </span>
          <span className={labelColor}>{Math.round(pct)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-250">
          <div className={`h-full rounded-full ${activeBarClass} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
