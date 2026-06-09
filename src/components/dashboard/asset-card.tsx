'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  PiggyBank, 
  TrendingUp, 
  Coins, 
  Percent, 
  ShieldCheck, 
  Flame, 
  HelpCircle,
  TrendingDown,
  Lock,
  Globe,
  PieChart as PieIcon
} from 'lucide-react';

export default function AssetCard() {
  const [activeTab, setActiveTab] = useState('savings');

  // SAVINGS MICRO-APP STATE: Inflation impact simulator
  const [inflationRate, setInflationRate] = useState(3.0);
  const initialPower = 10000;
  const powerAfter5Years = Math.round(initialPower / Math.pow(1 + inflationRate / 100, 5));
  const lostPower = initialPower - powerAfter5Years;

  // STOCKS MICRO-APP STATE: Sector selection
  const [selectedSector, setSelectedSector] = useState<'tech' | 'finance' | 'defense' | 'staples'>('tech');
  const sectors = {
    tech: { name: 'Technology & AI', risk: 'High Growth', beta: '1.4', dividend: '0.8%', holdings: ['MSFT', 'AAPL', 'NVDA', 'GOOGL'], desc: 'High innovation and capital returns but exposed to rate hikes and rich valuations.' },
    finance: { name: 'Financial Services', risk: 'Moderate', beta: '1.1', dividend: '2.5%', holdings: ['JPM', 'GS', 'BAC', 'V'], desc: 'Benefits from higher interest rates, but highly cyclical and sensitive to loan defaults.' },
    defense: { name: 'Defense & Aerospace', risk: 'Moderate-Low', beta: '0.85', dividend: '1.9%', holdings: ['LMT', 'RTX', 'GD', 'NOC'], desc: 'Backed by government budgets and multi-year backlog contracts. Defensive and stable.' },
    staples: { name: 'Consumer Staples', risk: 'Defensive / Low', beta: '0.6', dividend: '3.1%', holdings: ['PG', 'KO', 'PEP', 'COST'], desc: 'Resilient during recessions as consumer demand is inelastic. Offers solid dividend income.' },
  };

  // CRYPTO MICRO-APP STATE: Real-time ticking price simulator
  const [prices, setPrices] = useState({
    btc: { price: 68420.50, change: 1.45 },
    eth: { price: 3480.20, change: -0.85 },
    sol: { price: 145.75, change: 4.82 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
        const btcTick = randFloat(-0.3, 0.3);
        const ethTick = randFloat(-0.4, 0.4);
        const solTick = randFloat(-0.8, 0.8);

        return {
          btc: { 
            price: Math.round((prev.btc.price * (1 + btcTick / 100)) * 100) / 100, 
            change: Math.round((prev.btc.change + btcTick) * 100) / 100 
          },
          eth: { 
            price: Math.round((prev.eth.price * (1 + ethTick / 100)) * 100) / 100, 
            change: Math.round((prev.eth.change + ethTick) * 100) / 100 
          },
          sol: { 
            price: Math.round((prev.sol.price * (1 + solTick / 100)) * 100) / 100, 
            change: Math.round((prev.sol.change + solTick) * 100) / 100 
          },
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card/30 backdrop-blur-2xl border border-border/80 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-primary/5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Interactive Asset Profiler</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Explore detailed risk vectors and live metrics for each asset class</p>
        </div>

        {/* Tab triggers */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-secondary/40 border border-border/60 p-1 rounded-2xl h-11">
            <TabsTrigger 
              value="savings" 
              className="rounded-xl px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-savings/20 data-[state=active]:text-savings data-[state=active]:border data-[state=active]:border-savings/30"
            >
              <PiggyBank className="w-3.5 h-3.5 mr-1.5" />
              Savings
            </TabsTrigger>
            <TabsTrigger 
              value="stocks" 
              className="rounded-xl px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-stocks/20 data-[state=active]:text-stocks data-[state=active]:border data-[state=active]:border-stocks/30"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Stocks
            </TabsTrigger>
            <TabsTrigger 
              value="crypto" 
              className="rounded-xl px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:bg-crypto/20 data-[state=active]:text-crypto data-[state=active]:border data-[state=active]:border-crypto/30"
            >
              <Coins className="w-3.5 h-3.5 mr-1.5" />
              Crypto
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-2">
        {/* SAVINGS PROFILE */}
        {activeTab === 'savings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Info */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-savings/10 border border-savings/20 text-savings rounded-2xl">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">High-Yield Savings & Cash</span>
                    <span className="bg-savings/10 border border-savings/30 text-savings text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Low Risk (1.0/10)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Underwritten by FDIC/government guarantees</p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Savings accounts, treasury bills, and certificate of deposits represent the foundational pillar of financial safety. These accounts are federally insured up to $250,000, ensuring near-perfect preservation of nominal capital.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Percent className="w-3 h-3 mr-1 text-savings" /> Target Yield
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">3.5% - 4.5% <span className="text-xs font-semibold text-muted-foreground">APY</span></p>
                </div>

                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-neon" /> Principal Safety
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">99.99% <span className="text-xs font-semibold text-muted-foreground">Insured</span></p>
                </div>
              </div>
            </div>

            {/* Savings Simulator Tool (Inflation Calculator) */}
            <div className="p-5 bg-secondary/15 border border-border/40 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-savings uppercase tracking-wider flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1 text-savings" />
                  Inflation Erosion Simulator (The Silent Risk)
                </h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  While nominal savings are 100% safe, high inflation erodes real purchasing power. Drag to see how a $10,000 cash balance degrades over 5 years.
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-300">Annual Inflation Rate:</span>
                  <span className="text-white bg-savings/20 border border-savings/20 px-2 py-0.5 rounded tabular-nums">{inflationRate.toFixed(1)}%</span>
                </div>
                <Slider
                  value={[inflationRate]}
                  min={1}
                  max={10}
                  step={0.1}
                  onValueChange={(val: any) => setInflationRate(Array.isArray(val) ? val[0] : val)}
                  className="[&>[data-slot=slider-range]]:bg-savings"
                />
              </div>

              {/* Outputs */}
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Real Value (5 Years)</span>
                  <p className="text-lg font-black text-white tracking-tight tabular-nums">${powerAfter5Years.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Purchasing Power Lost</span>
                  <p className="text-lg font-black text-destructive tracking-tight tabular-nums">-${lostPower.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STOCKS PROFILE */}
        {activeTab === 'stocks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Info */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-stocks/10 border border-stocks/20 text-stocks rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">Global Equities & Index Funds</span>
                    <span className="bg-stocks/10 border border-stocks/30 text-stocks text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Moderate Risk (5.0/10)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">High volatility in short term, strong long-term growth</p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Equity investments represent ownership in public corporations. Over decades, diversified stocks historically outpaced inflation and compound capital heavily. However, stock indexes can experience sharp 20%-35% drawdowns during macroeconomic recessions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1 text-stocks" /> Historical Return
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">~8.5% <span className="text-xs font-semibold text-muted-foreground">Compound</span></p>
                </div>

                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Percent className="w-3 h-3 mr-1 text-emerald-neon" /> Div Yield
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">1.5% - 3.0% <span className="text-xs font-semibold text-muted-foreground">Annually</span></p>
                </div>
              </div>
            </div>

            {/* Stocks Micro-App: Sector exposure explorer */}
            <div className="p-5 bg-secondary/15 border border-border/40 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stocks uppercase tracking-wider flex items-center">
                  <PieIcon className="w-4 h-4 mr-1 text-stocks" />
                  Sector Diversification Explorer
                </h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Equities are not monolithic. Click on a sector below to explore different risk and return configurations.
                </p>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(sectors) as Array<keyof typeof sectors>).map((key) => {
                  const s = sectors[key];
                  const isSelected = selectedSector === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSector(key)}
                      className={`text-xs font-bold py-2 px-3 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? 'bg-stocks/15 border-stocks text-white shadow-[0_0_8px_rgba(217,119,6,0.1)]'
                          : 'bg-secondary/30 border-border hover:bg-secondary/50 text-muted-foreground hover:text-white'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Active Sector Details Card */}
              <div className="bg-secondary/30 border border-border/40 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white">{sectors[selectedSector].name}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    selectedSector === 'tech' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    selectedSector === 'finance' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {sectors[selectedSector].risk}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-normal leading-relaxed">{sectors[selectedSector].desc}</p>
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 pt-1 border-t border-border/30">
                  <span>Beta (Volatility): <strong className="text-white">{sectors[selectedSector].beta}</strong></span>
                  <span>Holdings: <strong className="text-white">{sectors[selectedSector].holdings.join(', ')}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRYPTO PROFILE */}
        {activeTab === 'crypto' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Core Info */}
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-crypto/10 border border-crypto/20 text-crypto rounded-2xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">Cryptocurrencies & Digital Assets</span>
                    <span className="bg-crypto/10 border border-crypto/30 text-crypto text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Extreme Risk (9.5/10)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">High upside potential, intense regulatory & custody risk</p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Crypto assets exist on decentralized ledgers. They have provided astronomical returns over short horizons but are highly speculatory. They are vulnerable to severe systemic failures, hacking, project insolvencies, and sudden 80%+ bear market crashes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1 text-crypto animate-pulse" /> Volatility Index
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">Extreme <span className="text-xs font-semibold text-muted-foreground">Beta &gt; 3.0</span></p>
                </div>

                <div className="bg-secondary/20 border border-border/50 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1 text-destructive" /> Custody Risk
                  </span>
                  <p className="text-xl font-black text-white tracking-tight">Sovereign <span className="text-xs font-semibold text-destructive">Non-FDIC</span></p>
                </div>
              </div>
            </div>

            {/* Crypto Micro-App: Live ticking pricing board */}
            <div className="p-5 bg-secondary/15 border border-border/40 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-crypto uppercase tracking-wider flex items-center">
                    <Coins className="w-4 h-4 mr-1 text-crypto" />
                    Simulated Real-Time Feed
                  </h4>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-neon opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-neon"></span>
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Simulating extreme market ticking. Prices update dynamically to demonstrate price-fluctuation mechanics.
                </p>
              </div>

              {/* Live pricing tickers */}
              <div className="space-y-2.5 pt-1">
                {/* BTC Ticker */}
                <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-border/40 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg flex items-center justify-center font-bold text-xs">₿</div>
                    <div>
                      <span className="text-xs font-bold text-white">Bitcoin</span>
                      <span className="text-[9px] text-muted-foreground block font-bold leading-none">BTC</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black tracking-tight text-white tabular-nums">${prices.btc.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded leading-none ${prices.btc.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {prices.btc.change >= 0 ? '+' : ''}{prices.btc.change.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* ETH Ticker */}
                <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-border/40 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs">Ξ</div>
                    <div>
                      <span className="text-xs font-bold text-white">Ethereum</span>
                      <span className="text-[9px] text-muted-foreground block font-bold leading-none">ETH</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black tracking-tight text-white tabular-nums">${prices.eth.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded leading-none ${prices.eth.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {prices.eth.change >= 0 ? '+' : ''}{prices.eth.change.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* SOL Ticker */}
                <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-border/40 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg flex items-center justify-center font-bold text-xs">S</div>
                    <div>
                      <span className="text-xs font-bold text-white">Solana</span>
                      <span className="text-[9px] text-muted-foreground block font-bold leading-none">SOL</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black tracking-tight text-white tabular-nums">${prices.sol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded leading-none ${prices.sol.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {prices.sol.change >= 0 ? '+' : ''}{prices.sol.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
