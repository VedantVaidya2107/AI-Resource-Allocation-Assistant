'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Employee, Project, Task, Leave, mockEmployees, mockProjects, mockTasks } from './zoho';

interface State {
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  leaves: Leave[];
  geminiApiKey: string;
  weights: {
    skillMatch: number;
    availability: number;
    performance: number;
    deadline: number;
  };
  theme: 'dark' | 'light';
}

type Action =
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'SET_GEMINI_KEY'; payload: string }
  | { type: 'SET_WEIGHTS'; payload: State['weights'] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESET_DATA' };

const initialState: State = {
  employees: mockEmployees,
  projects: mockProjects,
  tasks: mockTasks,
  leaves: [],
  geminiApiKey: '',
  weights: {
    skillMatch: 40,
    availability: 30,
    performance: 20,
    deadline: 10,
  },
  theme: 'dark',
};

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EMPLOYEES': return { ...state, employees: action.payload };
    case 'ADD_EMPLOYEE': return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE': return { ...state, employees: state.employees.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'SET_PROJECTS': return { ...state, projects: action.payload };
    case 'ADD_PROJECT': return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT': return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'SET_TASKS': return { ...state, tasks: action.payload };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'SET_GEMINI_KEY': return { ...state, geminiApiKey: action.payload };
    case 'SET_WEIGHTS': return { ...state, weights: action.payload };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'RESET_DATA': return initialState;
    default: return state;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persistence (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem('ai_resource_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.employees) dispatch({ type: 'SET_EMPLOYEES', payload: parsed.employees });
      if (parsed.projects) dispatch({ type: 'SET_PROJECTS', payload: parsed.projects });
      if (parsed.tasks) dispatch({ type: 'SET_TASKS', payload: parsed.tasks });
      if (parsed.geminiApiKey) dispatch({ type: 'SET_GEMINI_KEY', payload: parsed.geminiApiKey });
      if (parsed.weights) dispatch({ type: 'SET_WEIGHTS', payload: parsed.weights });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_resource_store', JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
