'use client';

import React, { useState, useEffect } from 'react';
import { getZohoData, Employee } from '@/lib/zoho';
import { Scale, RefreshCw, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BalancerPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');

  useEffect(() => {
    getZohoData().then(data => setEmployees(data.employees));
  }, []);

  const handleBalance = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'balance' })
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error balancing workload:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-bold">Workload Balancer</h1>
          <p className="text-gray-400 mt-2">Optimize team distribution to prevent burnout and delays.</p>
        </div>
        <button 
          onClick={handleBalance}
          disabled={isAnalyzing}
          className="btn-primary flex items-center gap-2"
        >
          {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Scale size={20} />}
          Analyze & Balance
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Load List */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-outfit font-semibold mb-4">Current Load Distribution</h2>
          {employees.map((emp, idx) => (
            <div key={emp.id} className="glass-card !p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{emp.name}</span>
                <span className={`text-xs font-bold ${emp.currentLoad > 80 ? 'text-red-400' : 'text-accent-blue'}`}>
                  {emp.currentLoad}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    emp.currentLoad > 80 ? 'bg-red-500' : 'bg-accent-blue'
                  }`}
                  style={{ width: `${emp.currentLoad}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* AI Analysis */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-outfit font-semibold mb-4 flex items-center gap-2">
            AI Balancing Insights
          </h2>
          
          <div className="glass-card min-h-[400px] flex flex-col">
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
                <p className="text-gray-500 animate-pulse font-medium">Gemini is recalculating load vectors...</p>
              </div>
            ) : suggestions ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                  <Info className="text-accent-blue shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-accent-blue text-sm uppercase tracking-wider">Strategy Summary</h4>
                    <p className="text-sm text-gray-300 mt-1">Based on skill overlap and availability, Gemini has generated the following optimization path.</p>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-outfit text-lg">
                    {suggestions}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button className="btn-primary flex items-center gap-2">
                    Execute Reassignments <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4 text-center p-8">
                <Scale size={64} className="opacity-10" />
                <div>
                  <h3 className="text-xl font-bold opacity-30">No Active Analysis</h3>
                  <p className="text-sm mt-2 max-w-xs">Run the balancer to see which tasks should be moved to optimize team performance.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
