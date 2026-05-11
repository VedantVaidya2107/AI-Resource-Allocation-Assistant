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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assign Task', href: '/assign', icon: UserPlus },
  { name: 'Balancer', href: '/balancer', icon: Scale },
  { name: 'Delay Risks', href: '/risks', icon: AlertTriangle },
];

export default function Sidebar() {
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI response for demo purposes
    // In production, this would call /api/gemini/chat
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Based on current workload, Mike Johnson is overloaded (95%), but Alex Brown has significant capacity (85%). I suggest assigning the next UI task to Alex.` 
      }]);
    }, 1000);
  };

  return (
    <div className="relative flex">
      {/* Sidebar Navigation */}
      <motion.aside 
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="h-screen bg-navy-900 border-r border-white/10 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-outfit font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent"
            >
              ALLOCATOR
            </motion.h1>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
                  isActive ? "bg-accent-blue/10 text-accent-blue" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}>
                  <item.icon size={22} className={cn(isActive ? "text-accent-blue" : "group-hover:text-white")} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setShowChat(true)}
            className={cn(
              "w-full flex items-center gap-4 px-3 py-3 rounded-xl bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-all",
              isCollapsed && "justify-center"
            )}
          >
            <MessageSquare size={22} />
            {!isCollapsed && <span className="font-medium">AI Assistant</span>}
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
                    "p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-accent-blue text-white rounded-tr-none" : "glass text-gray-200 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
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
