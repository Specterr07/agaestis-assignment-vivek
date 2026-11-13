import React, { useState } from 'react';
import { useEmployees } from './hooks/useEmployees';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from './types/employee.types';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { SearchFilterBar } from './components/SearchFilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/EmployeeModal';
import { DeleteModal } from './components/DeleteModal';
import { Toast } from './components/ui/Toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/Button';

export const App: React.FC = () => {
  const {
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
    refetch,
    addEmployee,
    editEmployee,
    removeEmployee,
  } = useEmployees();

  // Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Handlers
  const handleOpenAdd = () => {
    setEmployeeToEdit(null);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEmployee = async (data: CreateEmployeeInput | UpdateEmployeeInput) => {
    if (employeeToEdit) {
      await editEmployee(employeeToEdit.id, data as UpdateEmployeeInput);
      setToast({ message: `Updated ${data.name || employeeToEdit.name} successfully`, type: 'success' });
    } else {
      await addEmployee(data as CreateEmployeeInput);
      setToast({ message: `Added ${data.name} to the directory`, type: 'success' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    await removeEmployee(employeeToDelete.id);
    setToast({ message: `Removed ${employeeToDelete.name} from directory`, type: 'success' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Brand & Actions Header */}
      <Header
        totalEmployees={employees.length}
        onAddClick={handleOpenAdd}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Notification Banner if Initial Fetch Failed */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-rose-800">Connection Error</h4>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={refetch}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        )}

        {/* Top Metric Cards */}
        <StatsOverview
          total={stats.total}
          active={stats.active}
          onLeave={stats.onLeave}
          departments={stats.departments}
        />

        {/* Live Search, Department & Mobile-Responsive Date Selector */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onClearDateFilter={clearDateFilter}
          filteredCount={filteredEmployees.length}
          totalCount={employees.length}
        />

        {/* Data Table with Alphabetical, Status Cycle, and Date Sorting */}
        <EmployeeTable
          employees={filteredEmployees}
          isLoading={loading}
          nameSort={nameSort}
          onToggleNameSort={toggleNameSort}
          dateSort={dateSort}
          onToggleDateSort={toggleDateSort}
          statusCycle={statusCycle}
          onCycleStatusSort={cycleStatusSort}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddNew={handleOpenAdd}
        />
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={employeeToDelete}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
