'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AssetAllocation, RiskProfile, SimulationResult, calculateSimulation } from '@/lib/types';
import AllocationChart from './charts/allocation-chart';
import ReturnProjection from './charts/return-projection';
import { TrendingUp, ShieldAlert, RotateCcw, ClipboardSignature, ArrowRight } from 'lucide-react';

interface AllocationSimulatorProps {
  allocation: AssetAllocation;
  onAllocationChange: (alloc: AssetAllocation) => void;
  userProfile: RiskProfile | null;
  onResetToProfile: () => void;
  onOpenSurvey: () => void;
}

export default function AllocationSimulator({
  allocation,
  onAllocationChange,
  userProfile,
  onResetToProfile,
  onOpenSurvey
}: AllocationSimulatorProps) {

  // Run the simulation math on the current allocation
  const simResult: SimulationResult = calculateSimulation(allocation);

  // Smart sliders linking: always sum to exactly 100%
  const handleSliderChange = (asset: keyof AssetAllocation, val: any) => {
    const newValue = Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0);
    const oldValue = allocation[asset];
    const delta = newValue - oldValue;
    
    if (delta === 0) return;

    const otherAssets = (Object.keys(allocation) as Array<keyof AssetAllocation>).filter(key => key !== asset);
    const otherSum = otherAssets.reduce((sum, key) => sum + allocation[key], 0);

    let newAllocation = { ...allocation };
    newAllocation[asset] = newValue;

    if (otherSum === 0) {
      // Distribute remaining evenly if other values are zero
      const rem = (100 - newValue) / 2;
      const r1 = Math.floor(rem);
      const r2 = 100 - newValue - r1;
      newAllocation[otherAssets[0]] = r1;
      newAllocation[otherAssets[1]] = r2;
    } else {
      let distributed = 0;
      otherAssets.forEach((key) => {
        const proportion = allocation[key] / otherSum;
        const subtract = delta * proportion;
        let finalVal = allocation[key] - subtract;
        finalVal = Math.max(0, Math.min(100, finalVal));
        newAllocation[key] = Math.round(finalVal);
        distributed += newAllocation[key];
      });

      // Ensure exact 100% sum
      const currentSum = newAllocation.savings + newAllocation.stocks + newAllocation.crypto;
      const diff = 100 - currentSum;
      if (diff !== 0) {
        // Adjust the other asset with the highest value
        const target = otherAssets.reduce((max, key) => newAllocation[key] > newAllocation[max] ? key : max, otherAssets[0]);
        newAllocation[target] = Math.max(0, newAllocation[target] + diff);
      }
    }

    onAllocationChange(newAllocation);
  };

  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sliders Control Panel */}
      <div className="lg:col-span-1 p-6 bg-card/40 backdrop-blur-xl border border-border rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/10 transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Allocation Mix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Drag sliders to adjust portfolio weight</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
              Sum: 100%
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-6 pt-2">
            {/* Savings Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-savings flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-savings" />
                  <span>Savings</span>
                </span>
                <span className="text-white font-extrabold tracking-tight tabular-nums">{allocation.savings}%</span>
              </div>
              <Slider
                value={[allocation.savings]}
                max={100}
                step={1}
                onValueChange={(val) => handleSliderChange('savings', val)}
                className="[&>[data-slot=slider-range]]:bg-savings"
              />
              <p className="text-[10px] text-muted-foreground">High liquidity, guaranteed yield, near-zero capital risk.</p>
            </div>

            {/* Stocks Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-stocks flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-stocks" />
                  <span>Stocks</span>
                </span>
                <span className="text-white font-extrabold tracking-tight tabular-nums">{allocation.stocks}%</span>
              </div>
              <Slider
                value={[allocation.stocks]}
                max={100}
                step={1}
                onValueChange={(val) => handleSliderChange('stocks', val)}
                className="[&>[data-slot=slider-range]]:bg-stocks"
              />
              <p className="text-[10px] text-muted-foreground">Diversified global index fund equities. Moderate volatility.</p>
            </div>

            {/* Crypto Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-crypto flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-crypto" />
                  <span>Crypto</span>
                </span>
                <span className="text-white font-extrabold tracking-tight tabular-nums">{allocation.crypto}%</span>
              </div>
              <Slider
                value={[allocation.crypto]}
                max={100}
                step={1}
                onValueChange={(val) => handleSliderChange('crypto', val)}
                className="[&>[data-slot=slider-range]]:bg-crypto"
              />
              <p className="text-[10px] text-muted-foreground">Digital currencies & smart contracts. Hyper volatile.</p>
            </div>
          </div>
        </div>

        {/* Profile Action Hooks */}
        <div className="border-t border-border/60 pt-5 mt-6 space-y-2.5">
          {userProfile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Assessed Profile:</span>
                <span className="text-primary font-extrabold">{userProfile}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetToProfile}
                className="w-full text-xs font-bold border-border/80 text-zinc-200 hover:text-white hover:bg-secondary/80 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset to Target Allocation
              </Button>
            </div>
          ) : (
            <div className="bg-secondary/20 border border-border/50 rounded-xl p-3 flex flex-col space-y-2.5">
              <span className="text-[10px] font-bold text-zinc-300 flex items-center">
                <ClipboardSignature className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Unprofiled Account
              </span>
              <Button
                size="sm"
                onClick={onOpenSurvey}
                className="w-full text-xs font-extrabold bg-primary text-black hover:bg-primary/90 rounded-xl py-1"
              >
                <span>Take Suitability Survey</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Breakdown Pie & Risk Indicators */}
      <div className="lg:col-span-1 p-6 bg-card/40 backdrop-blur-xl border border-border rounded-2xl flex flex-col justify-between group hover:border-primary/10 transition-all duration-300">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">Portfolio Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Visual asset concentration ratios</p>
          <AllocationChart allocation={allocation} />
        </div>

        {/* Dynamic Financial Math Indicators */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
          <div className="p-3 bg-secondary/20 border border-border/50 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground flex items-center uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-neon" />
              Est. Return
            </span>
            <div className="text-lg font-extrabold text-white tracking-tight tabular-nums">
              {formatPercent(simResult.expectedAnnualReturn)}
              <span className="text-[10px] font-semibold text-muted-foreground ml-1">/yr</span>
            </div>
          </div>

          <div className="p-3 bg-secondary/20 border border-border/50 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground flex items-center uppercase tracking-wider">
              <ShieldAlert className="w-3 h-3 mr-1 text-destructive" />
              Max Crash Drop
            </span>
            <div className="text-lg font-extrabold text-white tracking-tight tabular-nums">
              -{formatPercent(simResult.simulatedWorstCaseDrawdown)}
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Compounding Projection Line Chart */}
      <div className="lg:col-span-1 p-6 bg-card/40 backdrop-blur-xl border border-border rounded-2xl flex flex-col justify-between group hover:border-primary/10 transition-all duration-300">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">10-Year Growth Forecast</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Compounded returns starting with a $10,000 principal</p>
        </div>
        <div className="py-4">
          <ReturnProjection data={simResult.historicalGrowthData} />
        </div>
        <div className="text-[10px] text-muted-foreground text-center bg-secondary/10 border border-border/30 rounded-lg p-2 font-medium italic">
          Disclaimer: Projections are simulated using historical compound models. Past performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
}
