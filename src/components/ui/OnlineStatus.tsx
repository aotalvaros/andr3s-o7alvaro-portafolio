"use client"

interface OnlineStatusProps {
    text: string;
    backgroundColor: "bg-green-500" | "bg-red-500";
    textColor: "text-green-500" | "text-red-500";
}

export function OnlineStatus({ text, backgroundColor, textColor }: Readonly<OnlineStatusProps>) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-2 w-2 rounded-full ${backgroundColor} animate-pulse-glow`} />
        <div className={`absolute inset-0 h-2 w-2 rounded-full ${backgroundColor} animate-ping`} />
      </div>
      <span className={`hidden sm:inline-flex text-sm font-medium ${textColor}`}>{text}</span>
    </div>
  )
}
