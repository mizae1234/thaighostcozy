'use client';

import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import PanelFrame from './PanelFrame';

export default function InventoryPanel() {
  const quantities = useInventoryStore((state) => state.quantities);
  const getItem = useContentStore((state) => state.getItem);

  const entries = Object.entries(quantities).filter(([, qty]) => qty > 0);

  return (
    <div className="pointer-events-auto absolute right-5 top-20 w-48">
      <PanelFrame title="กระเป๋า">
        {entries.length === 0 && <div className="text-xs text-white/50">ว่างเปล่า</div>}
        <div className="flex flex-col gap-1">
          {entries.map(([itemKey, qty]) => (
            <div
              key={itemKey}
              className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1 text-xs text-white"
            >
              <span>{getItem(itemKey)?.name ?? itemKey}</span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                {qty}
              </span>
            </div>
          ))}
        </div>
      </PanelFrame>
    </div>
  );
}
