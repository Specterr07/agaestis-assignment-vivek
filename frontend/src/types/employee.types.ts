export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  phone?: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: EmployeeStatus;
  avatarUrl?: string;
  phone?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WorkforceStats {
  total: number;
  active: number;
  onLeave: number;
  terminated: number;
  departments: Record<string, number>;
}

export interface PaginatedEmployees {
  items: Employee[];
  pagination: PaginationMeta;
  stats?: WorkforceStats;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
