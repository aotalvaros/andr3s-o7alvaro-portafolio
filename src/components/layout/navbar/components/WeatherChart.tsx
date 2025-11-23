"use client"

import { formatDate } from "@/services/weather/utils/weatherFormatters"
import { ForecastItem } from "@/types/weather.interface"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"


interface WeatherChartProps {
  forecast: ForecastItem[]
}

export function WeatherChart({ forecast }: WeatherChartProps) {
  const chartData = forecast.map((item) => ({
    date: formatDate(item.dt),
    max: Math.round(item.temp.max),
    min: Math.round(item.temp.min),
    humidity: item.humidity,
  }))

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold mb-6">Gráfica de temperatura</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value: string) => `${value}°`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
            name="Máx"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--secondary))", r: 4 }}
            activeDot={{ r: 6 }}
            name="Mín"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
