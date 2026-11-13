import { EmployeeStatus } from '@prisma/client';

export interface CreateEmployeeDto {
  name: string;
  email: string;
  role: string;
  department?: string;
  status?: EmployeeStatus;
  avatarUrl?: string;
  phone?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: EmployeeStatus;
  avatarUrl?: string;
  phone?: string;
}

export interface EmployeeFilterQuery {
  search?: string;
  role?: string;
  department?: string;
  status?: EmployeeStatus;
  page?: string;
  limit?: string;
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
