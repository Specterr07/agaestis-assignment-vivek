import { EmployeeStatus } from '@prisma/client';

export interface CreateEmployeeDto {
  name: string;
  email: string;
  role: string;
  department?: string;
  status?: EmployeeStatus;
  avatarUrl?: string | null;
  phone?: string | null;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: EmployeeStatus;
  avatarUrl?: string | null;
  phone?: string | null;
}

export interface EmployeeFilterQuery {
  search?: string;
  role?: string;
  department?: string;
  status?: EmployeeStatus;
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
  statusPriority?: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'default';
  startDate?: string;
  endDate?: string;
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

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
  stats: WorkforceStats;
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
