import { useState, useEffect, useCallback, useMemo } from 'react';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee.types';
import { employeeApi } from '../api/employeeApi';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State (Client-Side Instant Filtering)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  // Fetch all employees from backend
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApi.getEmployees();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Instant filtered list using useMemo (zero flicker, 0ms latency)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept =
        selectedDepartment === 'ALL' || emp.department.toLowerCase() === selectedDepartment.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesDept;

      const matchesSearch =
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query);

      return matchesDept && matchesSearch;
    });
  }, [employees, searchQuery, selectedDepartment]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    const onLeave = employees.filter((e) => e.status === 'ON_LEAVE').length;

    const departments = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, onLeave, departments };
  }, [employees]);

  // Add Employee mutation
  const addEmployee = async (input: CreateEmployeeInput) => {
    const created = await employeeApi.createEmployee(input);
    setEmployees((prev) => [created, ...prev]);
    return created;
  };

  // Edit Employee mutation
  const editEmployee = async (id: number, input: UpdateEmployeeInput) => {
    const updated = await employeeApi.updateEmployee(id, input);
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? updated : emp)));
    return updated;
  };

  // Delete Employee mutation
  const removeEmployee = async (id: number) => {
    await employeeApi.deleteEmployee(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return {
    employees,
    filteredEmployees,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    stats,
    refetch: fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
  };
}
