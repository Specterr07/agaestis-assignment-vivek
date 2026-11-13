import { useState, useEffect, useCallback } from 'react';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  PaginationMeta,
  WorkforceStats,
} from '../types/employee.types';
import { employeeApi } from '../api/employeeApi';

export type StatusCycleType = 'default' | 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type SortDirection = 'asc' | 'desc' | null;

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [stats, setStats] = useState<WorkforceStats>({
    total: 0,
    active: 0,
    onLeave: 0,
    terminated: 0,
    departments: {},
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  // Date Range Filter State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Sorting States
  const [nameSort, setNameSort] = useState<SortDirection>(null);
  const [dateSort, setDateSort] = useState<SortDirection>('desc'); // Default newest first
  const [statusCycle, setStatusCycle] = useState<StatusCycleType>('default');

  // Debounce search query input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset to page 1 whenever filters or sorting change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedDepartment, startDate, endDate, nameSort, dateSort, statusCycle]);

  // Fetch from server with full query params
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let sortBy: string | undefined = undefined;
      let sortOrder: string | undefined = undefined;

      if (nameSort !== null) {
        sortBy = 'name';
        sortOrder = nameSort;
      } else if (dateSort !== null) {
        sortBy = 'createdAt';
        sortOrder = dateSort;
      }

      const res = await employeeApi.getEmployees({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        department: selectedDepartment !== 'ALL' ? selectedDepartment : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder,
        statusPriority: statusCycle,
      });

      setEmployees(res.items);
      setPagination(res.pagination);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    selectedDepartment,
    startDate,
    endDate,
    nameSort,
    dateSort,
    statusCycle,
  ]);

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
    setDateSort(null);
    setNameSort((prev) => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

  const toggleDateSort = () => {
    setNameSort(null);
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

  // Add Employee mutation
  const addEmployee = async (input: CreateEmployeeInput) => {
    const created = await employeeApi.createEmployee(input);
    await fetchEmployees();
    return created;
  };

  // Edit Employee mutation
  const editEmployee = async (id: number, input: UpdateEmployeeInput) => {
    const updated = await employeeApi.updateEmployee(id, input);
    await fetchEmployees();
    return updated;
  };

  // Delete Employee mutation
  const removeEmployee = async (id: number) => {
    await employeeApi.deleteEmployee(id);
    await fetchEmployees();
  };

  return {
    employees,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
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
