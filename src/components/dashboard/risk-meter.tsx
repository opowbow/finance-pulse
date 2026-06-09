'use client';

import React, { useEffect, useState } from 'react';

interface RiskMeterProps {
  score: number; // 0 to 10
}

export default function RiskMeter({ score }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // SVG parameters
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  
  // We only want a semi-circle or a 3/4 circle (e.g., 270 degrees)
  // Let's make a 240 degree gauge
  const gaugeAngle = 240;
  const dashArray = (gaugeAngle / 360) * circumference;
  const dashOffset = circumference - dashArray;

  // The actual percentage filled (0.0 to 10.0 score mapped to 0 to 1)
  const fillPercentage = animatedScore / 10;
  const progressOffset = circumference - (fillPercentage * dashArray);

  // Determine color and status based on score
  let statusText = 'Low Risk';
  let gradientId = 'lowRiskGrad';
  let glowColor = 'rgba(59, 130, 246, 0.4)'; // blue
  let textColorClass = 'text-savings';

  if (animatedScore > 3.0 && animatedScore <= 5.5) {
    statusText = 'Moderate';
    gradientId = 'modRiskGrad';
    glowColor = 'rgba(217, 119, 6, 0.4)'; // gold/amber
    textColorClass = 'text-stocks';
  } else if (animatedScore > 5.5 && animatedScore <= 7.8) {
    statusText = 'Aggressive Growth';
    gradientId = 'highRiskGrad';
    glowColor = 'rgba(168, 85, 247, 0.4)'; // purple/pink
    textColorClass = 'text-crypto';
  } else if (animatedScore > 7.8) {
    statusText = 'Ultra Speculative';
    gradientId = 'ultraRiskGrad';
    glowColor = 'rgba(244, 63, 94, 0.5)'; // red
    textColorClass = 'text-destructive';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card/40 backdrop-blur-xl border border-border rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
      {/* Background ambient glow */}
      <div 
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full filter blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: glowColor }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full filter blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: glowColor }}
      />

      <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">Weighted Risk Level</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-[210deg]" viewBox="0 0 160 160">
          <defs>
            {/* Gradient definitions for premium neon gauges */}
            <linearGradient id="lowRiskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="modRiskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="highRiskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="ultraRiskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="oklch(0.2 0.015 240 / 60%)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />

          {/* Glowing under-stroke for depth */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth + 2}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out opacity-30 blur-[2px]"
          />

          {/* Interactive Colored Progress Bar */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Text inside the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-3">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums transition-all duration-300">
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
            Score (0-10)
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className={`text-base font-extrabold tracking-tight transition-colors duration-500 ${textColorClass}`}>
          {statusText}
        </span>
        <p className="text-xs text-muted-foreground max-w-[200px] mt-1.5 leading-relaxed leading-normal">
          {animatedScore <= 3.0 && "Extremely stable. Protected against market volatility, but subject to inflation creep."}
          {animatedScore > 3.0 && animatedScore <= 5.5 && "Balanced growth. Moderate protection with index-tracking gains."}
          {animatedScore > 5.5 && animatedScore <= 7.8 && "High-performance profile. Higher stock exposure, moderate risk."}
          {animatedScore > 7.8 && "Aggressive profile. Exposed to intense volatility. Highest potential returns."}
        </p>
      </div>
    </div>
  );
}
