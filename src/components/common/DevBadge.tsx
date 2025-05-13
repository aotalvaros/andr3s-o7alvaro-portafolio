'use client';

export function DevBadge() {
  return (
    <div className="absolute md:top-[80px] top-[140px] right-4 z-50">
      <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow animate-pulse">
        🚧 En desarrollo
      </span>
    </div>
  );
}