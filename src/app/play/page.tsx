'use client';

import Link from 'next/link';

interface StorySelection {
  slug: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

const STORIES: StorySelection[] = [
  {
    slug: 'pla-boo-thong',
    name: 'เกาะปลาบู่ทอง',
    description: 'เอาชีวิตรอดบนเกาะร้าง ค้นหาของวิเศษสามอย่างเพื่อช่วยเหลือนางเอื้อยและปลดปล่อยวิญญาณแม่ปลาบู่ทองจากคำสาปโบราณ',
    badge: 'Classic Folklore',
    badgeColor: 'from-amber-600 to-yellow-500',
    icon: '🐟',
    bgColor: 'bg-gradient-to-br from-amber-950/70 to-stone-900/90',
    borderColor: 'border-amber-700/50 hover:border-amber-400/80',
  },
  {
    slug: 'ghost-whisperer',
    name: 'มูเตลูทาวน์: บ้านนี้ผีชิล',
    description: 'ผูกมิตรกับวิญญาณนางตานีสุดชิค บำบัดความเครียดสะสม คราฟต์ศาลพระภูมิมูจิ และสะสมพรอารักษ์ฟาร์มกล้วยสไตล์สายมูมินิมอล',
    badge: 'Gen Z Cozy RPG',
    badgeColor: 'from-emerald-600 to-teal-500',
    icon: '🍌',
    bgColor: 'bg-gradient-to-br from-emerald-950/60 to-slate-900/90',
    borderColor: 'border-emerald-700/50 hover:border-emerald-400/80',
  },
];

export default function PlayMenuPage() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-radial-at-t from-stone-900 via-stone-950 to-black p-6 text-stone-100 selection:bg-amber-500 selection:text-black">
      {/* Background Decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-amber-500/10 blur-[128px]" />
        <div className="absolute -right-48 -bottom-48 h-96 w-96 rounded-full bg-emerald-500/10 blur-[128px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Title */}
        <h1 className="bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400 bg-clip-text text-4xl font-black uppercase tracking-wider text-transparent sm:text-5xl md:text-6xl drop-shadow-lg">
          THAI FOLKLORE SURVIVAL
        </h1>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/80 sm:text-sm">
          เลือกการผจญภัยและความมูของคุณ
        </p>

        {/* Story Selection Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 text-left">
          {STORIES.map((story) => (
            <div
              key={story.slug}
              className={`group relative flex flex-col justify-between rounded-3xl border-2 ${story.borderColor} ${story.bgColor} p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-emerald-950/20`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full bg-gradient-to-r ${story.badgeColor} px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black`}>
                    {story.badge}
                  </span>
                  <span className="text-4xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-125">
                    {story.icon}
                  </span>
                </div>
                
                <h2 className="mt-5 text-2xl font-black tracking-wide text-white group-hover:text-amber-300 transition-colors">
                  {story.name}
                </h2>
                
                <p className="mt-3 text-xs leading-relaxed text-stone-300/90 font-medium">
                  {story.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <Link
                  href={`/play/${story.slug}`}
                  className="flex w-full items-center justify-center rounded-xl bg-amber-500 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg transition-all hover:bg-yellow-400 active:scale-[0.98]"
                >
                  เริ่มการเดินทาง ➔
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-[10px] uppercase tracking-widest text-stone-500">
          Thai Occult Folklore & Survival Engine • © 2026
        </footer>
      </div>
    </main>
  );
}
