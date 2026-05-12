'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Scale, RefreshCw, AlertCircle, Info, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BalancerPage() {
  const { state } = useStore();
  const { employees } = state;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');

  const handleBalance = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'balance' })
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error balancing workload:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-accent-blue font-bold tracking-widest text-xs uppercase"
          >
            <div className="w-8 h-[1px] bg-accent-blue" />
            Operational Equilibrium
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Workload Balancer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-xl leading-relaxed"
          >
            Optimize team distribution and prevent burnout using AI-driven reassignment strategies.
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleBalance}
          disabled={isAnalyzing}
          className="btn-primary flex items-center gap-3 h-16 px-8 group"
        >
          {isAnalyzing ? (
            <RefreshCw className="animate-spin" size={24} />
          ) : (
            <Scale size={24} className="group-hover:rotate-12 transition-transform" />
          )}
          <span className="text-lg">Run Intelligence Audit</span>
        </motion.button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Load List */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">Live Capacity</h2>
            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Global Average: 62%</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {employees.map((emp, idx) => (
              <motion.div 
                key={emp.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.05) }}
                className="glass-card !p-6 flex flex-col gap-4 group hover:border-accent-blue/20"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      emp.currentLoad > 80 ? 'bg-rose-500/10 text-rose-400' : 'bg-accent-blue/10 text-accent-blue'
                    }`}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">{emp.name}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{emp.role}</span>
                    </div>
                  </div>
                  <span className={`text-xl font-black font-outfit ${emp.currentLoad > 80 ? 'text-rose-400' : 'text-accent-blue'}`}>
                    {emp.currentLoad}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${emp.currentLoad}%` }}
                    transition={{ duration: 1, delay: 0.6 + (idx * 0.05) }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      emp.currentLoad > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-blue-600 to-accent-blue'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Analysis */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3 space-y-6"
        >
          <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground mb-2 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Sparkles size={24} className="text-emerald-500" />
            </div>
            Optimization Strategy
          </h2>
          
          <div className="glass-card min-h-[500px] flex flex-col !p-10 relative overflow-hidden border-white/5">
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-accent-blue/5 border-t-accent-blue rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scale size={32} className="text-accent-blue animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-outfit font-black text-foreground dark:text-white animate-pulse">Computing Vectors</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Cross-referencing skillsets and project priorities</p>
                </div>
              </div>
            ) : suggestions ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-start gap-6 p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl">
                    <Info className="text-emerald-500" size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-500 text-[10px] uppercase tracking-[0.2em] mb-2">Gemini Recommendation</h4>
                    <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Optimization path successfully synthesized based on load balancing parameters.</p>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-400 leading-relaxed font-outfit text-xl p-6 bg-white/2 rounded-[2rem] border border-white/5">
                    {suggestions}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-end">
                  <button className="btn-primary flex items-center gap-3 h-14 px-8 group">
                    <span className="text-sm font-black uppercase tracking-widest">Execute Strategy</span> 
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-700 gap-8 text-center p-8 relative z-10">
                <div className="w-32 h-32 rounded-full bg-white/2 flex items-center justify-center border border-white/5">
                  <Scale size={64} className="opacity-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-outfit font-black text-slate-600 opacity-30">Await Parameters</h3>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 max-w-xs">Initialize the intelligence audit to begin optimization</p>
                </div>
              </div>
            )}

            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
