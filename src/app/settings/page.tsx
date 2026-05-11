'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Settings, Key, Sliders, Moon, Sun, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { state, dispatch } = useStore();

  const handleWeightChange = (key: keyof typeof state.weights, value: number) => {
    dispatch({
      type: 'SET_WEIGHTS',
      payload: { ...state.weights, [key]: value }
    });
  };

  const totalWeight = Object.values(state.weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-slate-500 font-bold tracking-widest text-xs uppercase"
        >
          <div className="w-8 h-[1px] bg-slate-500" />
          Control Plane
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-outfit font-black tracking-tight text-gradient"
        >
          System Configuration
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* API Credentials */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card !p-10 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-blue/10 text-accent-blue rounded-xl">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Gemini Intelligence</h2>
              <p className="text-slate-600 dark:text-slate-500 text-sm">Manage your Google AI access credentials.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Google Gemini API Key</label>
            <div className="relative">
              <input 
                type="password"
                value={state.geminiApiKey}
                onChange={(e) => dispatch({ type: 'SET_GEMINI_KEY', payload: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900/50 dark:bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-foreground transition-all font-mono"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {state.geminiApiKey ? (
                  <ShieldCheck size={20} className="text-emerald-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">
              Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </motion.section>

        {/* Scoring Weights */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card !p-10 space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-xl">
              <Sliders size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Allocation Logic</h2>
              <p className="text-slate-500 text-sm">Tune the weighting factors for AI recommendations.</p>
            </div>
          </div>

          <div className="space-y-8">
            {(Object.keys(state.weights) as Array<keyof typeof state.weights>).map((key) => (
              <div key={key} className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')} Match</span>
                  <span className="text-accent-purple">{state.weights[key]}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={state.weights[key]}
                  onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                />
              </div>
            ))}

            <div className={`pt-6 border-t border-white/5 flex items-center justify-between ${totalWeight !== 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Total Weight Consistency</span>
              <span className="font-bold">{totalWeight}% / 100%</span>
            </div>
          </div>
        </motion.section>

        {/* Global Controls */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card !p-10 space-y-8 lg:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground tracking-tight">Appearance Mode</h3>
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  {state.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-xs font-bold uppercase tracking-widest">{state.theme} Mode</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${state.theme === 'dark' ? 'bg-accent-blue' : 'bg-slate-700'}`}>
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.theme === 'dark' ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Data Integrity</h3>
              <button 
                onClick={() => dispatch({ type: 'RESET_DATA' })}
                className="w-full flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl hover:bg-rose-500/20 transition-all"
              >
                <RotateCcw size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Reset Mock Data</span>
              </button>
            </div>

            <div className="space-y-4 flex flex-col justify-end">
              <button 
                className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all font-bold uppercase tracking-widest text-xs"
              >
                <Save size={18} />
                Apply Global State
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
