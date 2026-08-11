'use client';

import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import PanelFrame from './PanelFrame';

export default function InventoryPanel() {
  const quantities = useInventoryStore((state) => state.quantities);
  const getItem = useContentStore((state) => state.getItem);

  const entries = Object.entries(quantities).filter(([, qty]) => qty > 0);

  return (
    <div className="pointer-events-auto absolute right-2 top-[55px] md:right-5 md:top-20 w-64 md:w-72 origin-top-right scale-[0.65] md:scale-100">
      <PanelFrame title="กระเป๋า">
        {entries.length === 0 && <div className="text-xs text-stone-400">ว่างเปล่า</div>}
        <div className="flex flex-col gap-1">
          {entries.map(([itemKey, qty]) => (
            <div
              key={itemKey}
              className="flex items-center justify-between rounded-lg bg-stone-100 px-2 py-1 text-xs text-stone-800 font-bold"
            >
              <span>{getItem(itemKey)?.name ?? itemKey}</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-250 px-1.5 py-0.5 text-[10px] font-black text-emerald-750">
                {qty}
              </span>
            </div>
          ))}
        </div>
      </PanelFrame>
    </div>
  );
}
