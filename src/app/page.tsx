'use client';

import React, { useEffect, useState } from 'react';
import { getZohoData, Employee, Project, Task } from '@/lib/zoho';
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
  const [data, setData] = useState<{employees: Employee[], projects: Project[], tasks: Task[]} | null>(null);

  useEffect(() => {
    getZohoData().then(setData);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const overloadedCount = data.employees.filter(e => e.currentLoad > 80).length;
  const atRiskCount = data.tasks.filter(t => t.status === 'At Risk').length;

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
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
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
          value={data.employees.length} 
          icon={<Users className="text-accent-blue" size={24} />} 
          trend="+2 this month"
          description="Total number of active staff members across all departments including part-time and full-time."
        />
        <SummaryCard 
          title="Active Projects" 
          value={data.projects.length} 
          icon={<Briefcase className="text-accent-cyan" size={24} />} 
          trend="4 in pipeline"
          description="Ongoing client projects currently in development or testing phase."
        />
        <SummaryCard 
          title="Overloaded" 
          value={overloadedCount} 
          icon={<AlertCircle className="text-rose-400" size={24} />} 
          trend="Needs attention"
          isAlert={overloadedCount > 0}
          description="Employees with a workload exceeding 80%. Consider reassigning tasks to prevent burnout."
        />
        <SummaryCard 
          title="Available Capacity" 
          value="45%" 
          icon={<TrendingUp className="text-emerald-400" size={24} />} 
          trend="Avg. across team"
          description="Remaining team bandwidth calculated by subtracting current load from total 100% capacity."
        />
      </motion.div>

      {/* Team Heatmap */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-outfit font-bold tracking-tight text-white">Workload Heatmap</h2>
            <p className="text-slate-500 text-sm">Visual distribution of task density per resource.</p>
          </div>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-2">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Optimal</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" /> Balanced</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" /> Critical</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {data.employees.map((employee, idx) => (
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
                <h3 className="font-bold text-lg tracking-tight group-hover:text-accent-blue transition-colors">{employee.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{employee.role}</p>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Utilization</span>
                  <span className={employee.currentLoad > 80 ? 'text-rose-400' : 'text-slate-200'}>
                    {employee.currentLoad}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${employee.currentLoad}%` }}
                    transition={{ duration: 1, delay: 0.8 + (idx * 0.05) }}
                    className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                      employee.currentLoad > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 
                      employee.currentLoad > 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects and Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
            {data.tasks.slice(0, 4).map((task, idx) => (
              <motion.div 
                key={task.id} 
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-6 bg-slate-950/30 rounded-3xl border border-white/5 hover:border-accent-blue/30 transition-all"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-100">{task.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{task.project}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                    {task.status}
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pt-1">Due {task.deadline}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card !p-10 space-y-8"
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
            {data.projects.map(project => (
              <div key={project.id} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-slate-100 tracking-tight">{project.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-outfit text-white">{project.progress}%</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Completion</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-accent-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, isAlert, description }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      onClick={() => setIsExpanded(!isExpanded)}
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
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-outfit font-black tracking-tight text-white">{value}</h3>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 pt-6 border-t border-white/5 relative z-10"
          >
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {description}
            </p>
            <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isAlert ? 'text-rose-400' : 'text-accent-blue'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isAlert ? 'bg-rose-500' : 'bg-accent-blue'}`} />
              Live System Telemetry
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Click to Expand Insight</div>
        </div>
      )}
    </motion.div>
  );
}
