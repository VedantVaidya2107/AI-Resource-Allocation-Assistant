'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Users, UserPlus, Search, Edit3, Trash2, Mail, Briefcase, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeesPage() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredEmployees = state.employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

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
            Human Capital
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Employee Directory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Manage your high-performance team, monitor individual bandwidth, and track core competencies.
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 h-14 px-8"
        >
          <UserPlus size={20} />
          Add Personnel
        </motion.button>
      </header>

      {/* Search & Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-foreground transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((employee, idx) => (
            <motion.div
              key={employee.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card flex flex-col gap-8 group hover:border-accent-blue/30"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-accent-blue font-black text-xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{employee.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mt-1">
                      <Briefcase size={12} className="text-accent-blue" />
                      {employee.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500" />
                    Current Load
                  </span>
                  <span className={employee.currentLoad > 80 ? 'text-rose-400' : 'text-slate-600 dark:text-slate-200'}>
                    {employee.currentLoad}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${employee.currentLoad}%` }}
                    className={`h-full rounded-full ${
                      employee.currentLoad > 80 ? 'bg-rose-500' : 
                      employee.currentLoad > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {employee.skills.map(skill => (
                  <span key={skill} className="text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-slate-400 group-hover:border-accent-blue/20 group-hover:text-slate-200 transition-all">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${employee.availability === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {employee.availability}
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline">
                  View Analytics
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card max-w-2xl w-full p-10 space-y-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
                    <UserPlus size={24} />
                  </div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight">Onboard Personnel</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">✕</button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newEmployee = {
                  id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  department: 'Engineering',
                  skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
                  currentLoad: 0,
                  pastPerformance: 100,
                  availability: 'Active' as const,
                  workingHours: 40,
                  joinDate: new Date().toISOString().split('T')[0],
                  leaveSchedule: []
                };
                dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
                setShowAddModal(false);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Legal Name</label>
                  <input name="name" required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-foreground" placeholder="e.g. Alexander Pierce" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Professional Role</label>
                  <input name="role" required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-foreground dark:text-white" placeholder="e.g. Lead Systems Architect" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Core Competencies (CSV)</label>
                  <input name="skills" required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-foreground dark:text-white" placeholder="React, Python, AWS, Kubernetes" />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-14 rounded-2xl border border-white/5 text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 h-14 rounded-2xl bg-accent-blue text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-accent-blue/20 hover:bg-blue-600 transition-all px-12"
                  >
                    Activate Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
