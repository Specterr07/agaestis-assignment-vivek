import { useState, useEffect, useCallback, useMemo } from 'react';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee.types';
import { employeeApi } from '../api/employeeApi';

export type StatusCycleType = 'default' | 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type SortDirection = 'asc' | 'desc' | null;

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  // Date Range Filter State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Sorting States
  const [nameSort, setNameSort] = useState<SortDirection>(null);
  const [dateSort, setDateSort] = useState<SortDirection>('desc'); // Default to newest first
  const [statusCycle, setStatusCycle] = useState<StatusCycleType>('default');

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

  // Handlers for sorting cycles
  const cycleStatusSort = () => {
    setStatusCycle((prev) => {
      switch (prev) {
        case 'default':
          return 'ACTIVE';
        case 'ACTIVE':
          return 'ON_LEAVE';
        case 'ON_LEAVE':
          return 'TERMINATED';
        case 'TERMINATED':
          return 'default';
        default:
          return 'default';
      }
    });
  };

  const toggleNameSort = () => {
    setDateSort(null); // Clear date sort when user explicitly sorts by name
    setNameSort((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleDateSort = () => {
    setNameSort(null); // Clear name sort when user explicitly sorts by date
    setDateSort((prev) => {
      if (prev === null) return 'desc';
      if (prev === 'desc') return 'asc';
      return null;
    });
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // Pure, robust filtering and sorting pipeline with useMemo
  const filteredEmployees = useMemo(() => {
    // 1. Filter phase
    const filtered = employees.filter((emp) => {
      // Department filter
      const matchesDept =
        selectedDepartment === 'ALL' ||
        emp.department.toLowerCase() === selectedDepartment.toLowerCase();
      if (!matchesDept) return false;

      // Text search filter (Name, Email, Role)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesSearch =
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Timezone-safe Date Filter (Full day boundaries)
      if (startDate) {
        const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
        const startBoundary = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0).getTime();
        if (new Date(emp.createdAt).getTime() < startBoundary) return false;
      }

      if (endDate) {
        const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
        const endBoundary = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999).getTime();
        if (new Date(emp.createdAt).getTime() > endBoundary) return false;
      }

      return true;
    });

    // 2. Sort phase
    return [...filtered].sort((a, b) => {
      // A. Status Cycle Sorting (Priority group first)
      if (statusCycle !== 'default') {
        const isAPriority = a.status === statusCycle;
        const isBPriority = b.status === statusCycle;
        if (isAPriority && !isBPriority) return -1;
        if (!isAPriority && isBPriority) return 1;
      }

      // B. Alphabetical Sort on Employee Name
      if (nameSort !== null) {
        const nameComparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        return nameSort === 'asc' ? nameComparison : -nameComparison;
      }

      // C. Joined Date Sort
      if (dateSort !== null) {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return dateSort === 'asc' ? timeA - timeB : timeB - timeA;
      }

      // Default fallback: Order by created_at DESC (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [employees, searchQuery, selectedDepartment, startDate, endDate, nameSort, dateSort, statusCycle]);

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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearDateFilter,
    nameSort,
    toggleNameSort,
    dateSort,
    toggleDateSort,
    statusCycle,
    cycleStatusSort,
    stats,
    refetch: fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
  };
}
