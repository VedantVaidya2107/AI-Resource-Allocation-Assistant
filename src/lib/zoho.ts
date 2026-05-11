export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  currentLoad: number; // Percentage
  pastPerformance: number; // Percentage
  availability: number; // Percentage
}

export interface Task {
  id: string;
  name: string;
  project: string;
  deadline: string;
  requiredSkills: string[];
  status: 'Open' | 'In Progress' | 'Completed' | 'At Risk';
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  deadline: string;
  status: string;
  progress: number;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Backend Developer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs'],
    currentLoad: 40,
    pastPerformance: 92,
    availability: 60,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    role: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX'],
    currentLoad: 30,
    pastPerformance: 88,
    availability: 70,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Fullstack Developer',
    skills: ['Node.js', 'React', 'APIs', 'AWS'],
    currentLoad: 95,
    pastPerformance: 85,
    availability: 5,
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Azure'],
    currentLoad: 60,
    pastPerformance: 90,
    availability: 40,
  },
  {
    id: '5',
    name: 'Alex Brown',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'CSS', 'React'],
    currentLoad: 15,
    pastPerformance: 95,
    availability: 85,
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    name: 'Build Payment API',
    project: 'Alpha',
    deadline: '2026-05-20',
    requiredSkills: ['Node.js', 'REST APIs'],
    status: 'Open',
  },
  {
    id: 't2',
    name: 'Design Dashboard UI',
    project: 'Alpha',
    deadline: '2026-05-18',
    requiredSkills: ['React', 'UI/UX'],
    status: 'In Progress',
    assignedTo: '2',
  },
  {
    id: 't3',
    name: 'Database Migration',
    project: 'Beta',
    deadline: '2026-05-25',
    requiredSkills: ['PostgreSQL'],
    status: 'Open',
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Project Alpha',
    client: 'TechCorp',
    deadline: '2026-06-01',
    status: 'Active',
    progress: 45,
  },
  {
    id: 'p2',
    name: 'Project Beta',
    client: 'FinLeap',
    deadline: '2026-07-15',
    status: 'Delayed',
    progress: 20,
  }
];

export async function getZohoData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    employees: mockEmployees,
    tasks: mockTasks,
    projects: mockProjects,
  };
}
