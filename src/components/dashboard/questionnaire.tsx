'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RISK_QUESTIONS, getProfileFromScore, PROFILE_ALLOCATIONS, RiskProfile, AssetAllocation } from '@/lib/types';
import { ShieldCheck, TrendingUp, HelpCircle, ChevronRight, Check } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (profile: RiskProfile, allocation: AssetAllocation) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Questionnaire({ onComplete, isOpen, onClose }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset questionnaire state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers([]);
      setSelectedOption(null);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentStep < RISK_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final score
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      const avgScore = sum / RISK_QUESTIONS.length;
      const profile = getProfileFromScore(avgScore);
      const allocation = PROFILE_ALLOCATIONS[profile];

      // Save to localStorage
      localStorage.setItem('finance-pulse-profile', profile);
      localStorage.setItem('finance-pulse-allocation', JSON.stringify(allocation));
      
      onComplete(profile, allocation);
      onClose();
    }
  };

  const activeQuestion = RISK_QUESTIONS[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border/80 text-foreground p-6 rounded-3xl backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center space-x-2 text-primary">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-neon">Investor Suitability Survey</span>
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight mt-1 text-white">
            Discover Your Risk Pulse
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Complete this brief multi-step evaluation to construct an optimized investment profile that matches your financial temperament.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Tracker */}
        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-6 flex">
          {RISK_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className={`flex-1 h-full transition-all duration-500 border-r border-card last:border-r-0 ${
                idx <= currentStep ? 'bg-primary shadow-[0_0_8px_oklch(0.75_0.15_150)]' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Question Panel */}
        <div className="space-y-6">
          <div className="flex space-x-3 items-start">
            <div className="flex items-center justify-center bg-primary/10 text-primary border border-primary/20 w-8 h-8 rounded-lg font-bold text-sm shrink-0 mt-0.5">
              {currentStep + 1}
            </div>
            <h4 className="text-lg font-bold tracking-tight text-white leading-snug">
              {activeQuestion.text}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedOption === opt.score;
              return (
                <button
                  key={oIdx}
                  onClick={() => setSelectedOption(opt.score)}
                  className={`flex items-center justify-between text-left p-4 rounded-2xl border transition-all duration-300 group ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(16,185,129,0.15)] text-primary-foreground'
                      : 'bg-secondary/40 border-border hover:bg-secondary/80 hover:border-muted-foreground/30'
                  }`}
                >
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                  }`}>
                    {opt.text}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-3 ${
                    isSelected ? 'bg-primary border-primary' : 'border-zinc-500'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/60">
          <span className="text-xs text-muted-foreground font-semibold">
            Question {currentStep + 1} of {RISK_QUESTIONS.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="rounded-xl px-5 py-2 font-bold tracking-tight bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
          >
            {currentStep < RISK_QUESTIONS.length - 1 ? (
              <span className="flex items-center space-x-1">
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <span>Analyze Results</span>
                <TrendingUp className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
