'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReturnProjectionProps {
  data: Array<{
    year: number;
    savingsValue: number;
    stocksValue: number;
    cryptoValue: number;
    totalValue: number;
  }>;
}

export default function ReturnProjection({ data }: ReturnProjectionProps) {
  // Format numbers to short currency forms (e.g. $12.4K)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatYAxis = (tickItem: number) => {
    return `$${(tickItem / 1000).toFixed(0)}k`;
  };

  return (
    <div className="w-full h-[260px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            {/* Gradient fill for area overlay */}
            <linearGradient id="totalValueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="5%" stopColor="var(--emerald-neon)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--emerald-neon)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="oklch(0.22 0.015 240 / 30%)" 
          />
          <XAxis 
            dataKey="year" 
            tickLine={false}
            axisLine={false}
            stroke="oklch(0.7 0.015 240)"
            fontSize={11}
            fontWeight={600}
            tickFormatter={(year) => (year === 0 ? 'Now' : `Yr ${year}`)}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            stroke="oklch(0.7 0.015 240)"
            fontSize={11}
            fontWeight={600}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            cursor={{ stroke: 'oklch(0.75 0.15 150 / 20%)', strokeWidth: 1.5 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-zinc-950/95 border border-zinc-800 p-3.5 rounded-2xl shadow-2xl text-xs backdrop-blur-md space-y-2">
                    <p className="font-extrabold text-zinc-300">
                      Year {item.year} Projection
                    </p>
                    <div className="space-y-1.5 font-semibold">
                      <div className="flex justify-between items-center space-x-8">
                        <span className="text-zinc-400">Savings:</span>
                        <span className="text-savings text-right">{formatCurrency(item.savingsValue)}</span>
                      </div>
                      <div className="flex justify-between items-center space-x-8">
                        <span className="text-zinc-400">Stocks:</span>
                        <span className="text-stocks text-right">{formatCurrency(item.stocksValue)}</span>
                      </div>
                      <div className="flex justify-between items-center space-x-8">
                        <span className="text-zinc-400">Crypto:</span>
                        <span className="text-crypto text-right">{formatCurrency(item.cryptoValue)}</span>
                      </div>
                      <div className="border-t border-zinc-800 my-1 pt-1.5 flex justify-between items-center space-x-8">
                        <span className="font-bold text-white">Total:</span>
                        <span className="text-emerald-neon font-bold text-sm text-right">{formatCurrency(item.totalValue)}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Main Area Area */}
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="var(--emerald-neon)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#totalValueGrad)"
            animationDuration={600}
            className="transition-all duration-300"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
