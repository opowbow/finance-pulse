export type RiskProfile = 'Conservative' | 'Moderate' | 'Growth' | 'Aggressive';

export interface AssetAllocation {
  savings: number; // percentage (0 - 100)
  stocks: number;  // percentage (0 - 100)
  crypto: number;  // percentage (0 - 100)
}

export interface SimulationResult {
  weightedRiskScore: number; // 0.0 to 10.0
  expectedAnnualReturn: number; // percentage
  simulatedWorstCaseDrawdown: number; // percentage
  historicalGrowthData: Array<{
    year: number;
    savingsValue: number;
    stocksValue: number;
    cryptoValue: number;
    totalValue: number;
  }>;
}

export interface Question {
  id: number;
  text: string;
  options: Array<{
    text: string;
    score: number; // risk score contributor
  }>;
}

export const RISK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How would you describe your primary financial goal?",
    options: [
      { text: "Preserve capital and avoid any losses", score: 1 },
      { text: "Generate reliable income with low volatility", score: 3 },
      { text: "Achieve steady growth over the long term", score: 6 },
      { text: "Maximize capital gains through high-risk assets", score: 9 }
    ]
  },
  {
    id: 2,
    text: "If your investment dropped 20% in a market downturn, what would you do?",
    options: [
      { text: "Sell everything immediately to prevent further losses", score: 1 },
      { text: "Panic and wait, but make no more investments", score: 3 },
      { text: "Hold tight and wait for a long-term recovery", score: 6 },
      { text: "Buy more at a discount to average down cost", score: 10 }
    ]
  },
  {
    id: 3,
    text: "What is your investment time horizon for this capital?",
    options: [
      { text: "Under 2 years (Short term)", score: 1 },
      { text: "2 to 5 years (Medium term)", score: 4 },
      { text: "5 to 10 years (Long term)", score: 7 },
      { text: "10+ years (Very long term)", score: 10 }
    ]
  },
  {
    id: 4,
    text: "What percentage of your total net worth are you investing?",
    options: [
      { text: "Less than 10% (Very safe margin)", score: 2 },
      { text: "10% to 25% (Standard allocation)", score: 5 },
      { text: "25% to 50% (Significant concentration)", score: 8 },
      { text: "Over 50% (High exposure)", score: 10 }
    ]
  }
];

export const PROFILE_ALLOCATIONS: Record<RiskProfile, AssetAllocation> = {
  Conservative: { savings: 70, stocks: 25, crypto: 5 },
  Moderate: { savings: 40, stocks: 50, crypto: 10 },
  Growth: { savings: 15, stocks: 65, crypto: 20 },
  Aggressive: { savings: 5, stocks: 55, crypto: 40 }
};

export function getProfileFromScore(avgScore: number): RiskProfile {
  if (avgScore <= 3.0) return 'Conservative';
  if (avgScore <= 5.5) return 'Moderate';
  if (avgScore <= 7.8) return 'Growth';
  return 'Aggressive';
}

// Simple financial math simulation
export function calculateSimulation(
  allocation: AssetAllocation,
  initialPrincipal: number = 10000,
  years: number = 10
): SimulationResult {
  const { savings, stocks, crypto } = allocation;

  // Expected returns and standard risk metrics
  // Savings: Safe, steady, 3.5% yield, 0% max drawdown
  // Stocks: Growth, moderate, 8.5% yield, 30% max drawdown in crisis
  // Crypto: Volatile, high-growth, 18.0% yield, 75% max drawdown in crisis
  const savingsYield = 0.035;
  const stocksYield = 0.085;
  const cryptoYield = 0.18;

  const savingsRisk = 0.5; // score contribution
  const stocksRisk = 5.0;
  const cryptoRisk = 9.5;

  const savingsDrawdown = 0.0;
  const stocksDrawdown = 0.32;
  const cryptoDrawdown = 0.78;

  // Weighted score
  const totalWeight = savings + stocks + crypto;
  const wSavings = savings / totalWeight;
  const wStocks = stocks / totalWeight;
  const wCrypto = crypto / totalWeight;

  const weightedRiskScore = (wSavings * savingsRisk + wStocks * stocksRisk + wCrypto * cryptoRisk);
  const expectedAnnualReturn = (wSavings * savingsYield + wStocks * stocksYield + wCrypto * cryptoYield) * 100;
  const simulatedWorstCaseDrawdown = (wSavings * savingsDrawdown + wStocks * stocksDrawdown + wCrypto * cryptoDrawdown) * 100;

  // Historical compounding trajectory over N years
  const historicalGrowthData = [];
  for (let year = 0; year <= years; year++) {
    const sValue = (savings / 100) * initialPrincipal * Math.pow(1 + savingsYield, year);
    const stValue = (stocks / 100) * initialPrincipal * Math.pow(1 + stocksYield, year);
    const crValue = (crypto / 100) * initialPrincipal * Math.pow(1 + cryptoYield, year);
    const total = sValue + stValue + crValue;

    historicalGrowthData.push({
      year,
      savingsValue: Math.round(sValue),
      stocksValue: Math.round(stValue),
      cryptoValue: Math.round(crValue),
      totalValue: Math.round(total)
    });
  }

  return {
    weightedRiskScore: Math.round(weightedRiskScore * 10) / 10,
    expectedAnnualReturn: Math.round(expectedAnnualReturn * 100) / 100,
    simulatedWorstCaseDrawdown: Math.round(simulatedWorstCaseDrawdown * 100) / 100,
    historicalGrowthData
  };
}
