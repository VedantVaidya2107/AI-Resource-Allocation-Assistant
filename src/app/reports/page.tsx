'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { BarChart3, TrendingUp, Users, PieChart, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const { state } = useStore();

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'Completed').length;
  const avgUtilization = Math.round(state.employees.reduce((acc, e) => acc + e.currentLoad, 0) / state.employees.length);

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-accent-blue font-bold tracking-widest text-xs uppercase"
          >
            <div className="w-8 h-[1px] bg-accent-blue" />
            Intelligence Briefing
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Analytics & ROI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Deep-dive into team velocity, resource optimization metrics, and strategic bottleneck analysis.
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center gap-2 h-14 px-8 text-white font-bold uppercase tracking-widest text-xs transition-all"
        >
          <Download size={18} />
          Export Datasets
        </motion.button>
      </header>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Overall Utilization', value: `${avgUtilization}%`, icon: <TrendingUp size={20} />, trend: '+4%', trendUp: true },
          { label: 'Task Throughput', value: completedTasks, icon: <BarChart3 size={20} />, trend: '+12%', trendUp: true },
          { label: 'Resource Capacity', value: state.employees.length, icon: <Users size={20} />, trend: 'Stable', trendUp: true },
          { label: 'Active Pipeline', value: state.projects.length, icon: <PieChart size={20} />, trend: '-2%', trendUp: false },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="glass-card flex flex-col gap-4 !p-6"
          >
            <div className="flex justify-between items-center">
              <div className="p-3 bg-white/5 text-accent-blue rounded-xl">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Utilization Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card !p-10 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">Team Bandwidth Analysis</h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Load %</div>
          </div>
          
          <div className="h-64 flex items-end justify-around gap-4 pt-8">
            {state.employees.map((e, idx) => (
              <div key={e.id} className="flex flex-col items-center gap-4 flex-1 h-full justify-end group">
                <div className="relative w-full flex justify-center items-end h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${e.currentLoad}%` }}
                    transition={{ delay: 0.7 + (idx * 0.1), duration: 1, ease: "easeOut" }}
                    className={`w-full max-w-[40px] rounded-t-xl relative ${
                      e.currentLoad > 80 ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 
                      e.currentLoad > 50 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 
                      'bg-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                    }`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {e.currentLoad}%
                    </div>
                  </motion.div>
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 truncate w-full text-center">
                  {e.name.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Velocity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card !p-10 space-y-8"
        >
          <h3 className="text-xl font-bold text-white tracking-tight">Project Health Vectors</h3>
          <div className="space-y-6">
            {state.projects.map((p, idx) => (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{p.name}</span>
                  <span className="text-white">{p.progress}% Complete</span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ delay: 0.8 + (idx * 0.2), duration: 1.5 }}
                    className={`h-full rounded-md ${
                      p.status === 'Delayed' ? 'bg-rose-500' : 'bg-gradient-to-r from-accent-blue to-cyan-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <Calendar size={12} />
              Next Reporting Cycle: May 20, 2026
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
