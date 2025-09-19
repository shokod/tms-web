export interface DashboardStats {
  totalHours: number;
  totalEmployees: number;
  activeProjects: number;
  pendingApprovals: number;
  weeklyEarnings: number;
  productivity: number;
  trends: {
    hours: { value: number; change: number };
    earnings: { value: number; change: number };
    productivity: { value: number; change: number };
  };
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  hoursThisWeek: number;
  status: 'active' | 'away' | 'offline';
  productivity: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  hoursLogged: number;
  budget: number;
  status: 'on-track' | 'behind' | 'completed' | 'at-risk';
  dueDate: string;
}

export interface RecentActivity {
  id: string;
  type: 'entry_submitted' | 'entry_approved' | 'project_updated' | 'employee_joined';
  message: string;
  timestamp: string;
  user: string;
  avatar: string;
}