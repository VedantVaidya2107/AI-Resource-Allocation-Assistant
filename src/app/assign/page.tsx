'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Send, CheckCircle2, User, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssignPage() {
  const { state, dispatch } = useStore();
  const [taskName, setTaskName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [skills, setSkills] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setRecommendations([]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recommend',
          payload: {
            task: {
              name: taskName,
              requiredSkills: skills.split(',').map(s => s.trim()),
              deadline: deadline
            }
          }
        })
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <header className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-accent-blue font-bold tracking-widest text-xs uppercase"
        >
          <div className="w-8 h-[1px] bg-accent-blue" />
          Intelligence Engine
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-outfit font-black tracking-tight text-gradient"
        >
          Resource Optimization
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
        >
          Define your requirements and let Gemini AI compute the most efficient resource allocation based on multi-dimensional scoring.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Task Form */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card !p-10 space-y-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-accent-blue/10 rounded-2xl">
              <Send size={24} className="text-accent-blue" />
            </div>
            <h2 className="text-2xl font-outfit font-black tracking-tight">Requirement Profiling</h2>
          </div>
          
          <form onSubmit={handleAnalyze} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Objective Title</label>
              <input 
                type="text" 
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Architect Core Infrastructure" 
                className="w-full input-field"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Parent Initiative</label>
              <select 
                required
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-white appearance-none cursor-pointer"
              >
                <option value="">Select Project...</option>
                {state.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Competency Stack (CSV)</label>
              <input 
                type="text" 
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Node.js, Kubernetes, Security" 
                className="w-full input-field"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Target Completion</label>
              <input 
                type="date" 
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full input-field"
              />
            </div>
            <button 
              type="submit" 
              disabled={isAnalyzing}
              className="w-full btn-primary group h-16 text-lg"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Computing Vectors...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                  <span>Execute AI Synthesis</span>
                </div>
              )}
            </button>
          </form>
        </motion.section>

        {/* Recommendations */}
        <section className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-outfit font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Target size={24} className="text-emerald-500" />
              </div>
              Algorithmic Matches
            </h2>
            {recommendations.length > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Confidence Level: 94%
              </span>
            )}
          </div>
          
          <div className="space-y-6 relative min-h-[400px]">
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-6 glass rounded-[2rem]">
                <div className="w-16 h-16 border-4 border-accent-blue/10 border-t-accent-blue rounded-full animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-outfit font-bold text-white animate-pulse">Running Neural Ranking</p>
                  <p className="text-xs uppercase tracking-widest font-black opacity-50">Checking team load, skill overlap & performance history</p>
                </div>
              </div>
            )}

            {!isAnalyzing && recommendations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-white/5 rounded-[2.5rem] text-slate-700 bg-slate-900/10 py-20">
                <Sparkles size={64} className="mb-6 opacity-10" />
                <p className="text-lg font-outfit font-bold opacity-30">Await Input Parameters</p>
              </div>
            )}

            <AnimatePresence>
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ x: 10, scale: 1.01 }}
                  className="glass-card !p-6 flex gap-6 items-center group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-accent-blue font-black text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500">
                    {rec.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-white">{rec.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified Personnel</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black font-outfit text-accent-blue">{rec.score}%</span>
                        <p className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">Compatibility</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                      {rec.reason}
                    </p>
                  </div>
                  <button className="p-4 rounded-2xl bg-white/5 group-hover:bg-accent-blue group-hover:text-white text-slate-600 transition-all active:scale-90">
                    <CheckCircle2 size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
