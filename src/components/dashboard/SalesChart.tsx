
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SalesChartProps {
  data: { date: string; [key: string]: number | string }[]; // Made dataKey dynamic
  dataKey: string; // e.g., "sales" or "revenue"
}

export function SalesChart({ data, dataKey }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--popover-foreground))', // Corrected from popover-foreground to border for consistency
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
          cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
        />
        <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
