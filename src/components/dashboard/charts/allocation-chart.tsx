'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AssetAllocation } from '@/lib/types';

interface AllocationChartProps {
  allocation: AssetAllocation;
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  const data = [
    { name: 'Savings', value: allocation.savings, color: 'var(--savings)', display: `${allocation.savings}%` },
    { name: 'Stocks', value: allocation.stocks, color: 'var(--stocks)', display: `${allocation.stocks}%` },
    { name: 'Crypto', value: allocation.crypto, color: 'var(--crypto)', display: `${allocation.crypto}%` },
  ].filter(item => item.value > 0);

  return (
    <div className="w-full h-[220px] flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="oklch(0.08 0.01 240)"
                strokeWidth={2}
                className="transition-all duration-300 hover:opacity-85 focus:outline-none"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-xl shadow-2xl text-xs backdrop-blur-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                      <span className="font-extrabold text-white">{data.name}</span>
                    </div>
                    <p className="text-zinc-400 mt-1 font-semibold">Allocation: <span className="text-white">{data.value}%</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Doughnut center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Mix</span>
        <span className="text-2xl font-extrabold tracking-tight text-white mt-0.5">
          {data.length} Class{data.length > 1 ? 'es' : ''}
        </span>
      </div>
    </div>
  );
}
