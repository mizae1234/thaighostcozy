'use client';

import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useParams } from 'next/navigation';
import { EventBus } from '@/game/EventBus';
import StatBar from './StatBar';
import PanelFrame from './PanelFrame';

export default function StatsBar() {
  const hunger = usePlayerStatsStore((state) => state.hunger);
  const thirst = usePlayerStatsStore((state) => state.thirst);
  const eatCoconut = usePlayerStatsStore((state) => state.eatCoconut);
  const coconutCount = useInventoryStore((state) => state.quantities.coconut ?? 0);

  const params = useParams();
  const slug = params?.slug;
  const isGhostMode = slug === 'ghost-whisperer';
  
  const buttonLabel = isGhostMode 
    ? `🍵 ดื่มชาใบตอง (${coconutCount})` 
    : `🥥 กินมะพร้าว (${coconutCount})`;

  return (
    <div className="pointer-events-auto absolute left-5 top-5 w-56">
      <PanelFrame>
        <div className="flex flex-col gap-2">
          <StatBar type="hunger" value={hunger} />
          <StatBar type="thirst" value={thirst} />
          <button
            type="button"
            onClick={(e) => {
              eatCoconut();
              e.currentTarget.blur();
            }}
            disabled={coconutCount <= 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {buttonLabel}
          </button>
          
          {isGhostMode && (
            <button
              type="button"
              onClick={(e) => {
                EventBus.emit('toggle-camera-zoom');
                e.currentTarget.blur();
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-yellow-600/35 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-slate-800"
            >
              🔍 ซูมกล้อง (2 ระยะ)
            </button>
          )}
        </div>
      </PanelFrame>
    </div>
  );
}
