'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ListTodo, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, User, Briefcase, Tag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TasksPage() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('All');
  const [isCreating, setIsCreating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTasks = state.tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = filterProject === 'All' || t.project === filterProject;
    return matchesSearch && matchesProject;
  });

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    
    const formData = new FormData(e.currentTarget);
    let assignedTo = formData.get('assignedTo') as string;
    const taskName = formData.get('name') as string;
    const skills = (formData.get('skills') as string).split(',').map(s => s.trim());
    const deadline = formData.get('deadline') as string;

    // Handle Auto-Assign Logic
    if (assignedTo === "") {
      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'recommend',
            payload: {
              task: { name: taskName, requiredSkills: skills, deadline: deadline },
              employees: state.employees
            }
          })
        });
        const aiData = await response.json();
        if (aiData.recommendations && aiData.recommendations.length > 0) {
          const bestMatchName = aiData.recommendations[0].name;
          const matchedEmployee = state.employees.find(e => e.name === bestMatchName);
          if (matchedEmployee) {
            assignedTo = matchedEmployee.id;
          }
        }
      } catch (error) {
        console.error("AI Assignment failed:", error);
      }
    }

    const newTask = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      name: taskName,
      description: 'Engineered via Tasks Management',
      projectId: 'PRJ-NEW', // Fallback
      project: formData.get('project') as string,
      assignedTo: assignedTo,
      status: 'In Progress' as const,
      deadline: deadline,
      type: formData.get('type') as any,
      complexity: formData.get('complexity') as any,
      requiredSkills: skills,
      estimatedHours: parseInt(formData.get('hours') as string) || 8
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    setIsCreating(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-accent-purple font-bold tracking-widest text-xs uppercase"
          >
            <div className="w-8 h-[1px] bg-accent-purple" />
            Operational Backlog
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-outfit font-black tracking-tight text-gradient"
          >
            Task Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl leading-relaxed"
          >
            Track individual performance vectors, maintain quality standards, and optimize the execution pipeline.
          </motion.p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn-primary !bg-accent-purple hover:!bg-purple-600 flex items-center gap-2 h-14 px-8 border-none shadow-purple-500/20"
        >
          <Plus size={20} />
          Create Task
        </motion.button>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white transition-all"
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select 
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white appearance-none cursor-pointer"
            >
              <option value="All">All Projects</option>
              {state.projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 10 }}
              className="glass-card !p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-accent-purple/30 transition-all border-white/5"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                <div className={`p-4 rounded-2xl shrink-0 ${
                  task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  task.status === 'At Risk' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-accent-purple/10 text-accent-purple'
                }`}>
                  <ListTodo size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-foreground tracking-tight truncate">{task.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-accent-purple" />
                      {task.project}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Tag size={12} className="text-slate-600" />
                      {task.type}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      task.complexity === 'High' ? 'text-rose-400' : 
                      task.complexity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        task.complexity === 'High' ? 'bg-rose-500' : 
                        task.complexity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {task.complexity} Complexity
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-white/5 pt-4 md:pt-0">
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500">Assigned To</p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {state.employees.find(e => e.id === task.assignedTo)?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-accent-purple">
                    {task.assignedTo ? (
                      <User size={18} />
                    ) : (
                      <AlertCircle size={18} className="text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500 flex items-center gap-1.5 justify-end">
                      <Clock size={10} />
                      Deadline
                    </p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{task.deadline}</p>
                  </div>
                  <button className="p-4 rounded-2xl bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-500 transition-all active:scale-90">
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
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
                  <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight">Engineer New Task</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">✕</button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Task Objective</label>
                  <input name="name" required className="w-full bg-slate-900/50 dark:bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-foreground" placeholder="e.g. Optimize Database Sharding" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Parent Project</label>
                    <select name="project" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white appearance-none">
                      {state.projects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Execution Category</label>
                    <select name="type" className="w-full bg-slate-900/50 dark:bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-foreground appearance-none">
                      <option value="UI Design">UI Design</option>
                      <option value="API Development">API Development</option>
                      <option value="Database">Database</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Testing">Testing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Complexity</label>
                    <select name="complexity" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white appearance-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Est. Hours</label>
                    <input name="hours" type="number" defaultValue={8} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Deadline</label>
                    <input name="deadline" type="date" required className="w-full bg-slate-900/50 dark:bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Required Capabilities (CSV)</label>
                  <input name="skills" required className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white" placeholder="React, Node.js, PostgreSQL" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Assigned Personnel</label>
                  <select name="assignedTo" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 text-white appearance-none">
                    <option value="">Auto-Assign (AI Recommended)</option>
                    {state.employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-14 rounded-2xl border border-white/5 text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreating}
                    className="flex-2 h-14 rounded-2xl bg-accent-purple text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-accent-purple/20 hover:bg-purple-600 transition-all px-12 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        Computing...
                      </div>
                    ) : 'Commit Task'}
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
