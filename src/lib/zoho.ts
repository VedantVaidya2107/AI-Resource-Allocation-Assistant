export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  currentLoad: number; // Percentage
  pastPerformance: number; // Percentage
  availability: 'Active' | 'On Leave' | 'Part-Time';
  workingHours: number;
  joinDate: string;
  leaveSchedule: Leave[];
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'Sick' | 'Casual' | 'Holiday';
  startDate: string;
  endDate: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
  project: string; // Keep for legacy compatibility
  type: string;
  complexity: 'Low' | 'Medium' | 'High';
  deadline: string;
  estimatedHours: number;
  requiredSkills: string[];
  status: 'Unassigned' | 'In Progress' | 'Completed' | 'At Risk';
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  startDate: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
  progress: number;
  teamIds: string[];
  tasksCount: number;
  completedTasks: number;
}

export const mockEmployees: Employee[] = [
  {
    id: 'E001',
    name: 'Rahul Sharma',
    role: 'Backend Engineer',
    department: 'Engineering',
    skills: ['Node.js', 'Python', 'REST APIs', 'PostgreSQL'],
    currentLoad: 40,
    pastPerformance: 92,
    availability: 'Active',
    workingHours: 8,
    joinDate: '2023-01-15',
    leaveSchedule: [],
  },
  {
    id: 'E002',
    name: 'Priya Patel',
    role: 'Frontend Developer',
    department: 'Engineering',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    currentLoad: 30,
    pastPerformance: 88,
    availability: 'Active',
    workingHours: 8,
    joinDate: '2023-03-10',
    leaveSchedule: [],
  },
  {
    id: 'E003',
    name: 'Mike Johnson',
    role: 'Fullstack Developer',
    department: 'Engineering',
    skills: ['Node.js', 'React', 'APIs', 'AWS'],
    currentLoad: 95,
    pastPerformance: 85,
    availability: 'Active',
    workingHours: 8,
    joinDate: '2022-11-20',
    leaveSchedule: [],
  },
  {
    id: 'E004',
    name: 'Emily Davis',
    role: 'DevOps Engineer',
    department: 'Operations',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Azure'],
    currentLoad: 60,
    pastPerformance: 90,
    availability: 'Active',
    workingHours: 8,
    joinDate: '2023-06-05',
    leaveSchedule: [],
  },
  {
    id: 'E005',
    name: 'Alex Brown',
    role: 'UI/UX Designer',
    department: 'Design',
    skills: ['Figma', 'Adobe XD', 'CSS', 'React'],
    currentLoad: 15,
    pastPerformance: 95,
    availability: 'Active',
    workingHours: 8,
    joinDate: '2023-02-14',
    leaveSchedule: [],
  }
];

export const mockProjects: Project[] = [
  {
    id: "P001",
    name: "Payment Gateway",
    description: "Building a secure payment processing engine with support for international currencies.",
    client: "FinLeap",
    startDate: "2024-05-01",
    deadline: "2025-06-15",
    priority: "Critical",
    status: "Active",
    progress: 45,
    teamIds: ["E001", "E002", "E003"],
    tasksCount: 12,
    completedTasks: 5,
  },
  {
    id: "P002",
    name: "Customer Dashboard",
    description: "Redesigning the main customer portal for better usability and data visualization.",
    client: "TechCorp",
    startDate: "2024-06-01",
    deadline: "2025-08-20",
    priority: "High",
    status: "Active",
    progress: 20,
    teamIds: ["E002", "E005"],
    tasksCount: 8,
    completedTasks: 1,
  }
];

export const mockTasks: Task[] = [
  {
    id: "T001",
    name: "Build Payment API",
    description: "Develop the core REST API endpoints for transaction processing.",
    projectId: "P001",
    project: "Payment Gateway",
    type: "API Work",
    complexity: "High",
    requiredSkills: ["Node.js", "REST APIs"],
    estimatedHours: 16,
    deadline: "2025-06-10",
    status: "In Progress",
    assignedTo: "E001",
  },
  {
    id: "T002",
    name: "Design Dashboard UI",
    description: "Create high-fidelity mockups and prototype for the new dashboard.",
    projectId: "P002",
    project: "Customer Dashboard",
    type: "UI Design",
    complexity: "Medium",
    requiredSkills: ["Figma", "UI/UX"],
    estimatedHours: 24,
    deadline: "2025-06-18",
    status: "In Progress",
    assignedTo: "E005",
  },
  {
    id: "T003",
    name: "Database Migration",
    description: "Migrate legacy customer data to the new PostgreSQL schema.",
    projectId: "P001",
    project: "Payment Gateway",
    type: "Database",
    complexity: "High",
    requiredSkills: ["PostgreSQL"],
    estimatedHours: 40,
    deadline: "2025-06-25",
    status: "Unassigned",
  }
];

export async function getZohoData() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    employees: mockEmployees,
    tasks: mockTasks,
    projects: mockProjects,
  };
}
