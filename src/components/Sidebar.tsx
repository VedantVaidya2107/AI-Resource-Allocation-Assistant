'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserPlus, 
  Scale, 
  AlertTriangle, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Send,
  Bot,
  User,
  Briefcase,
  ListTodo,
  Users,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '@/lib/store';
import { Task } from '@/lib/zoho';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Task Assignment', href: '/assign', icon: UserPlus },
  { name: 'Workload Balancer', href: '/balancer', icon: Scale },
  { name: 'Delay Risks', href: '/risks', icon: AlertTriangle },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your Resource Allocation Assistant. How can I help you today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { state, dispatch } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const currentInput = chatInput;
    const userMsg = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          payload: { message: currentInput, history: messages }
        })
      });
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error}` }]);
      } else {
        const aiResponse = data.response;
        setMessages(prev => [...prev, { role: 'bot', text: aiResponse.message }]);

        // Handle AI Actions
        if (aiResponse.action === 'create_task' && aiResponse.data) {
          const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            name: aiResponse.data.name,
            project: aiResponse.data.project,
            deadline: aiResponse.data.deadline,
            status: 'Pending',
            assignee: 'Unassigned',
            requiredSkills: ['General']
          };
          dispatch({ type: 'ADD_TASK', payload: newTask });
        } else if (aiResponse.action === 'update_status' && aiResponse.data) {
          const task = state.tasks.find(t => t.id === aiResponse.data.task_id || t.name.toLowerCase().includes(aiResponse.data.task_id?.toLowerCase()));
          if (task) {
            dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: aiResponse.data.status } });
          }
        } else if (aiResponse.action === 'reassign_task' && aiResponse.data) {
          const task = state.tasks.find(t => t.id === aiResponse.data.task_id || t.name.toLowerCase().includes(aiResponse.data.task_id?.toLowerCase()));
          if (task) {
            dispatch({ type: 'UPDATE_TASK', payload: { ...task, assignee: aiResponse.data.employee_name } });
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection lost. Please check your network.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex">
      {/* Sidebar Navigation */}
      <motion.aside 
        animate={{ width: isCollapsed ? 100 : 280 }}
        className="h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 shadow-2xl"
      >
        <div className="p-8 flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-outfit font-black tracking-tighter bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent"
            >
              ALLOCATOR
            </motion.h1>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 rounded-2xl hover:bg-white/5 text-slate-400 transition-colors border border-white/5"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative",
                  isActive ? "bg-accent-blue/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-8 bg-accent-blue rounded-r-full"
                    />
                  )}
                  <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-accent-blue" : "")} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-bold text-sm tracking-tight"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => setShowChat(true)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-br from-accent-blue to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all active:scale-95",
              isCollapsed && "justify-center"
            )}
          >
            <MessageSquare size={22} className="shrink-0" />
            {!isCollapsed && <span className="font-bold text-sm">AI Assistant</span>}
          </button>
        </div>
      </motion.aside>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-navy-800 border-l border-white/10 shadow-2xl z-30 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-outfit font-bold">Gemini AI</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-accent-blue text-white" : "bg-white/10 text-gray-300"
                  )}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' ? "bg-accent-blue text-white rounded-tr-none" : "glass text-gray-200 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-gray-300">
                    <Bot size={18} />
                  </div>
                  <div className="p-4 rounded-2xl glass text-gray-200 rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-navy-900/50">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
