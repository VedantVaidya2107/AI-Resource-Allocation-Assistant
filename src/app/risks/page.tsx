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
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-outfit font-bold">Delay Risk Panel</h1>
        <p className="text-gray-400 mt-2">Predictive analytics to identify projects at risk of missing deadlines.</p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-accent-blue" size={48} />
          <p className="text-gray-500 font-medium">Analyzing project timelines and resource buffers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {risks.map((risk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${risk.delay_probability > 50 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-outfit">{risk.project}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Project Status</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-bold font-outfit ${risk.delay_probability > 70 ? 'text-red-500' : 'text-yellow-500'}`}>
                    {risk.delay_probability}%
                  </span>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Delay Probability</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      risk.delay_probability > 70 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${risk.delay_probability}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-gray-600">
                  <span>Safe</span>
                  <span>Moderate Risk</span>
                  <span>Critical</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                  <ShieldAlert size={14} />
                  Top Risk Factor
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{risk.reason}"
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 btn-primary text-xs py-3">View Detailed Timeline</button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-3 rounded-lg transition-colors border border-white/10">
                  Mitigation Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Risk Metrics */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card !bg-red-500/5 !border-red-500/20 flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Critical Projects</p>
            <h4 className="text-2xl font-bold">1</h4>
          </div>
        </div>
        <div className="glass-card !bg-yellow-500/5 !border-yellow-500/20 flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">At Risk Tasks</p>
            <h4 className="text-2xl font-bold">3</h4>
          </div>
        </div>
        <div className="glass-card !bg-accent-blue/5 !border-accent-blue/20 flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Confidence Level</p>
            <h4 className="text-2xl font-bold">88%</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
