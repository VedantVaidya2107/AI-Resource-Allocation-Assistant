'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Target, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'predict_risks' })
    })
    .then(res => res.json())
    .then(data => {
      setRisks(data.risks || []);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      <header className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-rose-400 font-bold tracking-widest text-xs uppercase"
        >
          <div className="w-8 h-[1px] bg-rose-500" />
          Predictive Safeguards
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-outfit font-black tracking-tight text-gradient"
        >
          Delay Risk Panel
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
        >
          Utilizing historical velocity and resource saturation data to forecast project delivery bottlenecks.
        </motion.p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] glass rounded-[3rem] gap-8">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-accent-blue/5 border-t-accent-blue rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert size={32} className="text-accent-blue animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-outfit font-black text-white animate-pulse">Scanning Neural Timelines</p>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Calculating risk vectors and resource buffers</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {risks.map((risk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10 }}
              className="glass-card flex flex-col gap-10 !p-10 relative group overflow-hidden border-white/5"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${risk.delay_probability > 50 ? 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20' : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'}`}>
                    <AlertTriangle size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black font-outfit tracking-tight text-white">{risk.project}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Initiative</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-5xl font-black font-outfit ${risk.delay_probability > 70 ? 'text-rose-500' : 'text-amber-500'}`}>
                    {risk.delay_probability}%
                  </span>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest pt-1">Critical Index</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.delay_probability}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                      risk.delay_probability > 70 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Elevated</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Critical</span>
                </div>
              </div>

              <div className="p-8 bg-white/2 rounded-[2rem] border border-white/5 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="p-1.5 bg-white/5 rounded-lg">
                    <ShieldAlert size={16} />
                  </div>
                  Primary Risk Vector
                </div>
                <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
                  "{risk.reason}"
                </p>
              </div>

              <div className="flex gap-6 relative z-10">
                <button className="flex-1 btn-primary !h-14 !rounded-2xl text-xs font-black uppercase tracking-widest">View Deep Dive</button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5 h-14">
                  Audit Mitigation
                </button>
              </div>

              {/* Decoration */}
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 ${risk.delay_probability > 50 ? 'text-rose-500' : 'text-amber-500'}`}>
                <AlertTriangle size={160} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Risk Metrics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card !bg-rose-500/5 !border-rose-500/10 flex gap-6 items-center group cursor-default"
        >
          <div className="p-5 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-all">
            <TrendingDown size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">At-Risk Projects</p>
            <h4 className="text-3xl font-outfit font-black text-white">1</h4>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card !bg-amber-500/5 !border-amber-500/10 flex gap-6 items-center group cursor-default"
        >
          <div className="p-5 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-all">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Saturation Alarms</p>
            <h4 className="text-3xl font-outfit font-black text-white">3</h4>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card !bg-accent-blue/5 !border-accent-blue/10 flex gap-6 items-center group cursor-default"
        >
          <div className="p-5 rounded-2xl bg-accent-blue/10 text-accent-blue group-hover:bg-accent-blue/20 transition-all">
            <Target size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Forecast Confidence</p>
            <h4 className="text-3xl font-outfit font-black text-white">92%</h4>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
