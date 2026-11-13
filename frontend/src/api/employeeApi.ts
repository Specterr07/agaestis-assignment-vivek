import apiClient from './client';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput, ApiResponse } from '../types/employee.types';

export const employeeApi = {
  /**
   * Fetch all employees with optional query filters
   */
  async getEmployees(params?: { search?: string; role?: string; department?: string }): Promise<Employee[]> {
    const res = await apiClient.get<ApiResponse<Employee[]>>('/employees', { params });
    return res.data.data || [];
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
