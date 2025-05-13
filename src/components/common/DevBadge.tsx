'use client';

export function DevBadge() {
  return (
    <div className="relative right-4 z-50 mb-4">
      <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow animate-pulse">
        🚧 En desarrollo
      </span>
    </div>
  );
}