export function WeatherDetail({ icon, label, value }: Readonly<{ icon: React.ReactNode; label: string; value: string }>) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 backdrop-blur-sm"
    >
      <div className="text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  )
}
