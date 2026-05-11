'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { state } = useStore();
  const { employees, projects, tasks } = state;

  const overloadedCount = employees.filter(e => e.currentLoad > 80).length;
  const atRiskCount = tasks.filter(t => t.status === 'At Risk').length;

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-accent-blue font-bold tracking-widest text-xs uppercase"
        >
          <div className="w-8 h-[1px] bg-accent-blue" />
          Intelligent Operations
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-outfit font-black tracking-tight text-gradient"
        >
          Team Intelligence
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed font-medium"
        >
          Optimizing your project lifecycle with real-time AI resource scoring and workload distribution.
        </motion.p>
      </header>

      {/* Summary Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <SummaryCard 
          title="Total Employees" 
          value={employees.length} 
          icon={<Users className="text-accent-blue" size={24} />} 
          trend="+2 this month"
          description="Total number of active staff members across all departments."
          scrollToId="heatmap-section"
        >
          {employees.map(e => (
            <div key={e.id} className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <span className="text-foreground font-bold">{e.name}</span>
              <span className="text-slate-600 dark:text-slate-500 uppercase tracking-widest text-[9px] font-black">{e.role}</span>
            </div>
          ))}
        </SummaryCard>

        <SummaryCard 
          title="Active Projects" 
          value={projects.length} 
          icon={<Briefcase className="text-accent-cyan" size={24} />} 
          trend="4 in pipeline"
          description="Ongoing client projects currently in development."
          scrollToId="projects-section"
        >
          {projects.map(p => (
            <div key={p.id} className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-cyan/20 transition-colors">
              <span className="text-foreground font-bold">{p.name}</span>
              <span className="text-accent-cyan font-black">{p.progress}%</span>
            </div>
          ))}
        </SummaryCard>

        <SummaryCard 
          title="Overloaded" 
          value={overloadedCount} 
          icon={<AlertCircle className="text-rose-400" size={24} />} 
          trend="Needs attention"
          isAlert={overloadedCount > 0}
          description="Employees with a workload exceeding 80%."
          scrollToId="heatmap-section"
        >
          {employees.filter(e => e.currentLoad > 80).map(e => (
            <div key={e.id} className="flex justify-between items-center text-xs p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 transition-colors">
              <span className="text-rose-700 dark:text-rose-200 font-bold">{e.name}</span>
              <span className="text-rose-500 font-black">{e.currentLoad}% Load</span>
            </div>
          ))}
          {overloadedCount === 0 && <p className="text-xs text-slate-600 italic">No resource bottlenecks detected.</p>}
        </SummaryCard>

        <SummaryCard 
          title="Available Capacity" 
          value="45%" 
          icon={<TrendingUp className="text-emerald-400" size={24} />} 
          trend="Avg. across team"
          description="Remaining team bandwidth."
          scrollToId="heatmap-section"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Top Available Talent</p>
          {employees.slice().sort((a,b) => a.currentLoad - b.currentLoad).slice(0, 3).map(e => (
            <div key={e.id} className="flex justify-between items-center text-xs p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
              <span className="text-emerald-700 dark:text-emerald-200 font-bold">{e.name}</span>
              <span className="text-emerald-500 font-black">{100 - e.currentLoad}% Free</span>
            </div>
          ))}
        </SummaryCard>
      </motion.div>

      {/* Team Heatmap */}
      <section id="heatmap-section" className="space-y-8 scroll-mt-10">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-outfit font-bold tracking-tight text-foreground">Workload Heatmap</h2>
            <p className="text-slate-600 dark:text-slate-500 text-sm font-medium">Visual distribution of task density per resource.</p>
          </div>
          <div className="flex gap-6 text-xs font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 pb-2">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Optimal</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> Balanced</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" /> Critical</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {employees.map((employee, idx) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.05) }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
              }}
              className={`glass-card flex flex-col items-center text-center gap-6 relative group overflow-hidden border-white/5 transition-colors duration-500 ${
                employee.currentLoad > 80 ? 'hover:border-rose-500/30' : 
                employee.currentLoad > 50 ? 'hover:border-amber-500/30' : 'hover:border-emerald-500/30'
              }`}
            >
              <div className={`absolute top-0 inset-x-0 h-1 transition-opacity opacity-0 group-hover:opacity-100 ${
                employee.currentLoad > 80 ? 'bg-rose-500' : 
                employee.currentLoad > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-2xl transform transition-transform duration-500 group-hover:rotate-[10deg] ${
                employee.currentLoad > 80 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                employee.currentLoad > 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg tracking-tight group-hover:text-accent-blue transition-colors text-foreground">{employee.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500">{employee.role}</p>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-600 dark:text-slate-500">Utilization</span>
                  <span className={employee.currentLoad > 80 ? 'text-rose-500' : 'text-foreground'}>
                    {employee.currentLoad}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${employee.currentLoad}%` }}
                    className={`h-full rounded-full ${
                      employee.currentLoad > 80 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 
                      employee.currentLoad > 50 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 
                      'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Priority Tasks */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card !p-10 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-outfit font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-accent-blue/10 rounded-xl">
                <Clock size={24} className="text-accent-blue" />
              </div>
              Priority Tasks
            </h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 4).map((task, idx) => (
              <motion.div 
                key={task.id} 
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-6 bg-slate-100/50 dark:bg-slate-950/30 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-accent-blue/30 transition-all"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">{task.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{task.project}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                    {task.status}
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600 block pt-1">Due {task.deadline}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Project Vitals */}
        <motion.section 
          id="projects-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card !p-10 space-y-8 scroll-mt-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-outfit font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <TrendingUp size={24} className="text-emerald-500" />
              </div>
              Project Vitals
            </h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline">Full Audit</button>
          </div>
          <div className="space-y-10">
            {projects.map((project, idx) => (
              <div key={project.id} className="flex flex-col gap-6 p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-accent-blue/30 transition-all group/item">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-foreground group-hover/item:text-accent-blue transition-colors">{project.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-500">Client: {project.client}</p>
                  </div>
                  <div className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-lg text-[8px] font-black uppercase tracking-widest border border-accent-blue/20">
                    {project.status}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-600 dark:text-slate-500">Progress</span>
                    <span className="text-foreground">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-accent-blue"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-black text-slate-600 dark:text-slate-500 shadow-sm">
                        MB
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">Deadline</p>
                    <p className="text-[10px] font-bold text-slate-400">{project.deadline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, isAlert, description, children, scrollToId }: any) {
  const handleTeleport = () => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.div 
      layout
      onClick={handleTeleport}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}
      className={`glass-card cursor-pointer relative overflow-hidden group border-white/5 ${isAlert ? 'hover:border-rose-500/30' : 'hover:border-accent-blue/30'}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 transition-all duration-700 opacity-[0.03] group-hover:opacity-[0.1] -mr-8 -mt-8 ${isAlert ? 'text-rose-500' : 'text-accent-blue'}`}>
        {icon}
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl transition-all duration-500 ${isAlert ? 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20' : 'bg-accent-blue/10 text-accent-blue group-hover:bg-accent-blue/20'}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">{trend}</span>
        </div>
      </div>
      <div className="mt-8 space-y-1 relative z-10">
        <p className="text-slate-600 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-outfit font-black tracking-tight text-foreground">{value}</h3>
      </div>
      
      <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 relative z-10">
        <div className="p-1.5 bg-white/5 rounded-lg text-slate-400">
          <TrendingUp size={12} />
        </div>
        <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Click to Teleport to Data</div>
      </div>
    </motion.div>
  );
}
