'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Briefcase, Plus, Search, Calendar, Users, AlertTriangle, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProjects = state.projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-accent-cyan font-bold tracking-widest text-xs uppercase"
          >
            <div className="w-8 h-[1px] bg-accent-cyan" />
            Portfolio Lifecycle
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Strategic Projects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Orchestrate your high-stakes initiatives, monitor progress velocity, and identify algorithmic delay risks.
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary !bg-accent-cyan hover:!bg-cyan-600 flex items-center gap-2 h-14 px-8 border-none shadow-cyan-500/20"
        >
          <Plus size={20} />
          Launch Initiative
        </motion.button>
      </header>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white transition-all"
          />
        </div>
        
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
          <button className="p-2.5 bg-accent-cyan text-white rounded-xl shadow-lg shadow-accent-cyan/20">
            <LayoutGrid size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-white transition-colors">
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card !p-10 flex flex-col gap-10 group hover:border-accent-cyan/30"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan shadow-inner">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-outfit tracking-tight text-white group-hover:text-accent-cyan transition-colors">{project.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Client: {project.client}</p>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  project.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  project.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-white/5 text-slate-400 border-white/5'
                }`}>
                  {project.priority} Priority
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Development Progress</span>
                  <span className="text-white font-black">{project.progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent-cyan to-blue-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex -space-x-3">
                  {project.teamIds.map((id, i) => (
                    <div 
                      key={id} 
                      className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-400"
                      title={`Member ID: ${id}`}
                    >
                      {state.employees.find(e => e.id === id)?.name.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-500">
                    +{project.tasksCount - project.completedTasks}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Deadline</p>
                    <p className="text-xs font-bold text-slate-300">{project.deadline}</p>
                  </div>
                  <button className="p-4 rounded-2xl bg-white/5 hover:bg-accent-cyan hover:text-white text-slate-500 transition-all group/btn">
                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Project Modal */}
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
                  <div className="p-3 bg-accent-cyan/10 rounded-xl text-accent-cyan">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight">Initiate Project</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">✕</button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newProject = {
                  id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: formData.get('name') as string,
                  client: formData.get('client') as string,
                  description: formData.get('description') as string,
                  startDate: new Date().toISOString().split('T')[0],
                  deadline: formData.get('deadline') as string,
                  status: 'Active' as const,
                  priority: formData.get('priority') as any,
                  progress: 0,
                  teamIds: [],
                  tasksCount: 0,
                  completedTasks: 0
                };
                dispatch({ type: 'ADD_PROJECT', payload: newProject });
                setShowAddModal(false);
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Project Name</label>
                    <input name="name" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white" placeholder="e.g. Quantum Ledger" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Client Entity</label>
                    <input name="client" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white" placeholder="e.g. Global FinTech" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mission Description</label>
                  <textarea name="description" required rows={3} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white resize-none" placeholder="Primary objectives and scope..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Target Deadline</label>
                    <input name="deadline" type="date" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Strategic Priority</label>
                    <select name="priority" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-white appearance-none">
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Critical">Critical Priority</option>
                    </select>
                  </div>
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
                    className="flex-2 h-14 rounded-2xl bg-accent-cyan text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-accent-cyan/20 hover:bg-cyan-600 transition-all px-12"
                  >
                    Deploy Initiative
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
