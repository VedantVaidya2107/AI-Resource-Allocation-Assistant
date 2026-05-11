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
import { motion } from 'framer-motion';

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
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-outfit font-bold">Team Overview</h1>
        <p className="text-gray-400 mt-2">Real-time resource allocation and workload balance.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Employees" 
          value={data.employees.length} 
          icon={<Users className="text-accent-blue" />} 
          trend="+2 this month"
        />
        <SummaryCard 
          title="Active Projects" 
          value={data.projects.length} 
          icon={<Briefcase className="text-accent-cyan" />} 
          trend="4 in pipeline"
        />
        <SummaryCard 
          title="Overloaded" 
          value={overloadedCount} 
          icon={<AlertCircle className="text-red-400" />} 
          trend="Needs attention"
          isAlert={overloadedCount > 0}
        />
        <SummaryCard 
          title="Available Capacity" 
          value="45%" 
          icon={<TrendingUp className="text-green-400" />} 
          trend="Avg. across team"
        />
      </div>

      {/* Team Heatmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-outfit font-semibold">Workload Heatmap</h2>
          <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Low Load</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> High Load</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {data.employees.map((employee, idx) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card flex flex-col items-center text-center gap-4 ${
                employee.currentLoad > 80 ? 'border-red-500/30' : 
                employee.currentLoad > 50 ? 'border-yellow-500/30' : 'border-green-500/30'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                employee.currentLoad > 80 ? 'bg-red-500/20 text-red-400' : 
                employee.currentLoad > 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{employee.role}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Load</span>
                  <span className={employee.currentLoad > 80 ? 'text-red-400' : 'text-gray-200'}>
                    {employee.currentLoad}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      employee.currentLoad > 80 ? 'bg-red-500' : 
                      employee.currentLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${employee.currentLoad}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity / Active Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card">
          <h2 className="text-lg font-outfit font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-accent-blue" />
            Active Tasks
          </h2>
          <div className="space-y-4">
            {data.tasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-medium text-sm">{task.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Project: {task.project}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-gray-400">
                    {task.status}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1">Due {task.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card">
          <h2 className="text-lg font-outfit font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-accent-cyan" />
            Project Progress
          </h2>
          <div className="space-y-6">
            {data.projects.map(project => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <p className="text-xs text-gray-500">{project.client}</p>
                  </div>
                  <span className="text-xs font-bold text-accent-blue">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-blue rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend, isAlert }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`glass-card ${isAlert ? 'border-red-500/20' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white/5 rounded-lg">
          {icon}
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-outfit font-bold mt-1">{value}</h3>
      </div>
    </motion.div>
  );
}
