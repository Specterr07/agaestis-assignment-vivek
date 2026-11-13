import React from 'react';
import {
  Edit2,
  Trash2,
  Mail,
  Calendar,
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Employee } from '../types/employee.types';
import { DepartmentBadge, StatusBadge } from './ui/Badge';
import { Button } from './ui/Button';
import { SortDirection, StatusCycleType } from '../hooks/useEmployees';

export interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  nameSort: SortDirection;
  onToggleNameSort: () => void;
  dateSort: SortDirection;
  onToggleDateSort: () => void;
  statusCycle: StatusCycleType;
  onCycleStatusSort: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onAddNew: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  nameSort,
  onToggleNameSort,
  dateSort,
  onToggleDateSort,
  statusCycle,
  onCycleStatusSort,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  // Skeleton loader during fetch
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse hidden sm:block" />
              <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No employees found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          We couldn't find any employee matching your search or filters. Try adjusting your query or date range.
        </p>
        <Button variant="primary" size="sm" onClick={onAddNew}>
          Add New Employee
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200/80 select-none">
            <tr>
              {/* Employee Column Header (Alphabetical Sort) */}
              <th scope="col" className="px-6 py-3.5 font-semibold">
                <button
                  onClick={onToggleNameSort}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors focus:outline-none group text-left"
                  title="Sort alphabetically by Name"
                >
                  <span>Employee</span>
                  {nameSort === 'asc' ? (
                    <span className="inline-flex items-center gap-0.5 text-indigo-600 font-bold">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span className="text-[10px] lowercase">a-z</span>
                    </span>
                  ) : nameSort === 'desc' ? (
                    <span className="inline-flex items-center gap-0.5 text-indigo-600 font-bold">
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span className="text-[10px] lowercase">z-a</span>
                    </span>
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </button>
              </th>

              {/* Role & Department */}
              <th scope="col" className="px-6 py-3.5 font-semibold hidden md:table-cell">
                Role & Department
              </th>

              {/* Status Column Header (Status Cycle Sort) */}
              <th scope="col" className="px-6 py-3.5 font-semibold">
                <button
                  onClick={onCycleStatusSort}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors focus:outline-none group text-left"
                  title="Cycle status priority: Default -> Active -> On Leave -> Terminated"
                >
                  <span>Status</span>
                  {statusCycle === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      <ArrowDown className="w-3 h-3" /> Active
                    </span>
                  ) : statusCycle === 'ON_LEAVE' ? (
                    <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                      <ArrowDown className="w-3 h-3" /> On Leave
                    </span>
                  ) : statusCycle === 'TERMINATED' ? (
                    <span className="inline-flex items-center gap-0.5 text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-rose-200">
                      <ArrowDown className="w-3 h-3" /> Terminated
                    </span>
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </button>
              </th>

              {/* Joined Date Column Header (Date Sort) */}
              <th scope="col" className="px-6 py-3.5 font-semibold hidden lg:table-cell">
                <button
                  onClick={onToggleDateSort}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors focus:outline-none group text-left"
                  title="Sort by Joined Date"
                >
                  <span>Joined Date</span>
                  {dateSort === 'desc' ? (
                    <span className="inline-flex items-center gap-0.5 text-indigo-600 font-bold">
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span className="text-[10px] lowercase">newest</span>
                    </span>
                  ) : dateSort === 'asc' ? (
                    <span className="inline-flex items-center gap-0.5 text-indigo-600 font-bold">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span className="text-[10px] lowercase">oldest</span>
                    </span>
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </button>
              </th>

              {/* Actions */}
              <th scope="col" className="px-6 py-3.5 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => {
              const initials = emp.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              const formattedDate = new Date(emp.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Name, Avatar & Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {emp.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {emp.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{emp.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Department */}
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="font-medium text-slate-800">{emp.role}</div>
                    <div className="mt-1">
                      <DepartmentBadge department={emp.department} />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={emp.status} />
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        title="Edit employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
                        title="Delete employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>Showing {employees.length} employee records</span>
        <span className="text-[11px] text-slate-400">PostgreSQL 16 • ACID Compliant</span>
      </div>
    </div>
  );
};
