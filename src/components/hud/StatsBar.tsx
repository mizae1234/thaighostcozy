'use client';

import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import StatBar from './StatBar';
import PanelFrame from './PanelFrame';

export default function StatsBar() {
  const hunger = usePlayerStatsStore((state) => state.hunger);
  const thirst = usePlayerStatsStore((state) => state.thirst);
  const eatCoconut = usePlayerStatsStore((state) => state.eatCoconut);
  const coconutCount = useInventoryStore((state) => state.quantities.coconut ?? 0);

  return (
    <div className="pointer-events-auto absolute left-5 top-5 w-56">
      <PanelFrame>
        <div className="flex flex-col gap-2">
          <StatBar type="hunger" value={hunger} />
          <StatBar type="thirst" value={thirst} />
          <button
            type="button"
            onClick={() => eatCoconut()}
            disabled={coconutCount <= 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            🥥 กินมะพร้าว ({coconutCount})
          </button>
        </div>
      </PanelFrame>
    </div>
  );
}
