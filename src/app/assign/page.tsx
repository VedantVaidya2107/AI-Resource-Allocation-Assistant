'use client';

import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssignPage() {
  const [taskName, setTaskName] = useState('');
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <header>
        <h1 className="text-3xl font-outfit font-bold">AI Task Assignment</h1>
        <p className="text-gray-400 mt-2">Create a task and let Gemini find the best resource.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Task Form */}
        <section className="glass-card">
          <h2 className="text-lg font-outfit font-semibold mb-6 flex items-center gap-2">
            Task Details
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Task Name</label>
              <input 
                type="text" 
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Build Payment API" 
                className="w-full input-field"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Required Skills (Comma separated)</label>
              <input 
                type="text" 
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Node.js, REST APIs" 
                className="w-full input-field"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deadline</label>
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
              className="w-full btn-primary flex items-center justify-center gap-2 h-12"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Gemini is analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Get AI Recommendations
                </>
              )}
            </button>
          </form>
        </section>

        {/* Recommendations */}
        <section className="space-y-4">
          <h2 className="text-lg font-outfit font-semibold flex items-center gap-2">
            Top Recommendations
          </h2>
          
          <div className="space-y-4 relative min-h-[300px]">
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
                <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
                <p className="text-sm animate-pulse">Scanning team availability and skills...</p>
              </div>
            )}

            {!isAnalyzing && recommendations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-2xl text-gray-600">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Enter task details to see AI suggestions</p>
              </div>
            )}

            <AnimatePresence>
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card !p-4 flex gap-4 items-center group cursor-pointer hover:border-accent-blue/50"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold shrink-0">
                    {rec.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{rec.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-accent-blue">{rec.score}%</span>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Score</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-accent-blue hover:text-white text-gray-500 transition-all opacity-0 group-hover:opacity-100">
                    <CheckCircle2 size={20} />
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
