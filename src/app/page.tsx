import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold">เกาะปลาบู่ทอง</h1>
      <p className="text-slate-300">Thai folklore survival game — MVP</p>
      <Link
        href="/play"
        className="rounded bg-emerald-600 px-6 py-2 font-semibold hover:bg-emerald-500"
      >
        เริ่มเล่น
      </Link>
    </main>
  );
}
