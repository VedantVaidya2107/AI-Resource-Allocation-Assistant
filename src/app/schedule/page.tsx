'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Calendar, Plus, User, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchedulePage() {
  const { state } = useStore();
  const [currentDate] = useState(new Date());

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-amber-500 font-bold tracking-widest text-xs uppercase"
          >
            <div className="w-8 h-[1px] bg-amber-500" />
            Temporal Planning
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Leave & Availability
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Forecast resource availability, manage out-of-office schedules, and optimize project timelines against team downtime.
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary !bg-amber-500 hover:!bg-amber-600 flex items-center gap-2 h-14 px-8 border-none shadow-amber-500/20"
        >
          <Plus size={20} />
          Register Leave
        </motion.button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Calendar View Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass-card !p-10 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black font-outfit text-white">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
              <Filter size={14} />
              All Departments
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`p-6 bg-slate-950/30 min-h-[120px] relative border-t border-l border-white/5 group hover:bg-white/[0.02] transition-colors ${i + 1 === currentDate.getDate() ? 'bg-accent-blue/5' : ''}`}>
                <span className={`text-xs font-bold ${i + 1 === currentDate.getDate() ? 'text-accent-blue' : 'text-slate-600'}`}>{i + 1}</span>
                {i === 14 && (
                  <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-rose-400">
                    Rahul (Sick)
                  </div>
                )}
                {i === 20 && (
                  <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-amber-400">
                    Priya (Casual)
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Availability */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card !p-10 space-y-8"
        >
          <h3 className="text-xl font-bold text-white tracking-tight">Upcoming Downtime</h3>
          <div className="space-y-6">
            {state.employees.filter(e => e.leaveSchedule.length > 0).length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto">
                  <Clock size={32} />
                </div>
                <p className="text-slate-500 text-sm">Full availability detected for the current sprint cycle.</p>
              </div>
            ) : (
              <p className="text-slate-500">Active schedule monitoring...</p>
            )}
          </div>

          <div className="pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Staff Availability Pulse</h4>
            <div className="space-y-4">
              {state.employees.slice(0, 4).map(e => (
                <div key={e.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[8px] font-black text-slate-400">
                      {e.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{e.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
