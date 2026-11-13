import apiClient from './client';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  ApiResponse,
  PaginatedEmployees,
} from '../types/employee.types';

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  statusPriority?: string;
  search?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
}

export const employeeApi = {
  /**
   * Fetch employees with server-side pagination, sorting, and filtering
   */
  async getEmployees(params?: GetEmployeesParams): Promise<PaginatedEmployees> {
    const res = await apiClient.get<ApiResponse<PaginatedEmployees>>('/employees', { params });
    if (res.data.data?.items && res.data.data.pagination) {
      return res.data.data;
    }
    // Fallback if data is returned as flat array
    const rawItems = (res.data.data as any) || [];
    return {
      items: Array.isArray(rawItems) ? rawItems : [],
      pagination: {
        total: Array.isArray(rawItems) ? rawItems.length : 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  /**
   * Fetch a single employee by ID
   */
  async getEmployeeById(id: number): Promise<Employee> {
    const res = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return res.data.data!;
  },

  /**
   * Create a new employee
   */
  async createEmployee(data: CreateEmployeeInput): Promise<Employee> {
    const res = await apiClient.post<ApiResponse<Employee>>('/employees', data);
    return res.data.data!;
  },

  /**
   * Update an employee by ID
   */
  async updateEmployee(id: number, data: UpdateEmployeeInput): Promise<Employee> {
    const res = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return res.data.data!;
  },

  /**
   * Delete an employee by ID
   */
  async deleteEmployee(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/employees/${id}`);
  },
};
