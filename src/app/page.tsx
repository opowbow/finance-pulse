'use client';

import React, { useState, useEffect } from 'react';
import { AssetAllocation, RiskProfile, PROFILE_ALLOCATIONS, calculateSimulation } from '@/lib/types';
import RiskMeter from '@/components/dashboard/risk-meter';
import Questionnaire from '@/components/dashboard/questionnaire';
import AllocationSimulator from '@/components/dashboard/allocation-simulator';
import AssetCard from '@/components/dashboard/asset-card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  HelpCircle, 
  User, 
  Award, 
  Database, 
  ShieldAlert, 
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Wallet
} from 'lucide-react';

export default function DashboardPage() {
  // Load initial states from localStorage if available
  const [allocation, setAllocation] = useState<AssetAllocation>({
    savings: 40,
    stocks: 50,
    crypto: 10
  });
  const [userProfile, setUserProfile] = useState<RiskProfile | null>(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [hasCheckedStorage, setHasCheckedChecked] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('finance-pulse-profile');
      const savedAllocation = localStorage.getItem('finance-pulse-allocation');
      
      if (savedProfile) {
        setUserProfile(savedProfile as RiskProfile);
      }
      if (savedAllocation) {
        setAllocation(JSON.parse(savedAllocation));
      }
    } catch (e) {
      console.error("Failed to read localStorage", e);
    }
    setHasCheckedChecked(true);
  }, []);

  // Calculate simulated parameters
  const sim = calculateSimulation(allocation);

  const handleSurveyComplete = (profile: RiskProfile, alloc: AssetAllocation) => {
    setUserProfile(profile);
    setAllocation(alloc);
  };

  const handleResetToProfile = () => {
    if (userProfile) {
      const targetAlloc = PROFILE_ALLOCATIONS[userProfile];
      setAllocation(targetAlloc);
      localStorage.setItem('finance-pulse-allocation', JSON.stringify(targetAlloc));
    }
  };

  const handleManualAllocationChange = (newAlloc: AssetAllocation) => {
    setAllocation(newAlloc);
    // If the manual change deviates from the target, we don't necessarily clear the profile,
    // but we let them reset to it easily using the reset hook.
    localStorage.setItem('finance-pulse-allocation', JSON.stringify(newAlloc));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary pb-12">
      {/* Background ambient light overlay for premium look */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] rounded-full bg-savings/5 filter blur-[180px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl shadow-[0_0_15px_oklch(0.75_0.15_150_/_15%)]">
              <Activity className="w-5 h-5 text-emerald-neon animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight flex items-center">
                Finance<span className="text-emerald-neon">Pulse</span>
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Risk Engine v1.0</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dynamic Status / Onboarding Badge */}
            {hasCheckedStorage && (
              userProfile ? (
                <div className="hidden sm:flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-2xl">
                  <Award className="w-4 h-4 text-emerald-neon animate-bounce" />
                  <span className="text-xs font-black text-white">{userProfile} Profile</span>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSurveyOpen(true)}
                  className="hidden sm:flex items-center space-x-2 bg-secondary/30 border border-border/80 px-3.5 py-1 rounded-2xl hover:bg-secondary/60 hover:border-primary/30 transition-all group"
                  id="navbar-onboarding-badge"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  <span className="text-xs font-bold text-zinc-300 group-hover:text-white">Get Risk-Profileed</span>
                </button>
              )
            )}

            {/* Quick survey trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSurveyOpen(true)}
              className="text-xs font-bold border-border hover:bg-secondary/80 text-zinc-200 hover:text-white rounded-xl h-9"
              id="btn-trigger-survey"
            >
              <User className="w-4 h-4 mr-1.5" />
              {userProfile ? 'Retake Survey' : 'Suitability Survey'}
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full pt-8 space-y-8 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-border/40">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl" id="hero-title">
              Portfolio Risk Intelligence Center
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-3xl leading-relaxed leading-normal">
              Fully customize your allocations, monitor asset profiles under simulated market crashes, analyze buying-power erosion from inflation, and review live-ticking digital asset markets.
            </p>
          </div>

          <div className="flex gap-2 self-stretch md:self-auto">
            {userProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToProfile}
                className="flex-1 md:flex-none text-xs font-bold border-border text-zinc-300 hover:text-white rounded-xl h-10"
                id="btn-reset-allocation"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reset Allocation
              </Button>
            )}
          </div>
        </section>

        {/* METRICS STATS RIBBON */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="stats-ribbon">
          {/* principal */}
          <div className="p-5 bg-card/25 backdrop-blur-xl border border-border/60 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-primary/10 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <Wallet className="w-3.5 h-3.5 mr-1.5 text-primary" /> Initial Balance
              </span>
              <p className="text-2xl font-black text-white tracking-tight tabular-nums">$10,000</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-xl">
              <Database className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* expected compound returns */}
          <div className="p-5 bg-card/25 backdrop-blur-xl border border-border/60 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-primary/10 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-neon" /> Projected Return
              </span>
              <p className="text-2xl font-black text-white tracking-tight tabular-nums">
                {sim.expectedAnnualReturn.toFixed(2)}%
                <span className="text-xs font-bold text-muted-foreground ml-1">APY</span>
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <ArrowUpRight className="w-5 h-5 text-emerald-neon" />
            </div>
          </div>

          {/* maximum crash projection */}
          <div className="p-5 bg-card/25 backdrop-blur-xl border border-border/60 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-primary/10 transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-destructive animate-pulse" /> Worst-Case Drawdown
              </span>
              <p className="text-2xl font-black text-destructive tracking-tight tabular-nums">
                -{sim.simulatedWorstCaseDrawdown.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
          </div>
        </section>

        {/* CORE INTERACTIVE SIMULATOR & RISK DIAL GRID */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Slider and charting panels (3 cols on XL) */}
          <div className="xl:col-span-3">
            <AllocationSimulator
              allocation={allocation}
              onAllocationChange={handleManualAllocationChange}
              userProfile={userProfile}
              onResetToProfile={handleResetToProfile}
              onOpenSurvey={() => setIsSurveyOpen(true)}
            />
          </div>

          {/* Radial Risk Meter (1 col on XL) */}
          <div className="xl:col-span-1">
            <RiskMeter score={sim.weightedRiskScore} />
          </div>
        </section>

        {/* DETAILED INTERACTIVE DOSSIERS */}
        <section className="pt-2">
          <AssetCard />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 mt-16 pt-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-zinc-500">FinancePulse is a mock wealth-modeling simulator. All investments carry market risk.</p>
        <p>&copy; {new Date().getFullYear()} FinancePulse Systems. Built on Next.js, Radix UI, and Tailwind CSS. All rights reserved.</p>
      </footer>

      {/* ONBOARDING QUESTIONNAIRE WIZARD */}
      <Questionnaire
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onComplete={handleSurveyComplete}
      />
    </div>
  );
}
