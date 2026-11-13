import React, { useState } from 'react';
import { Search, X, Calendar, ChevronDown, ChevronUp, RotateCcw, Briefcase } from 'lucide-react';

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onClearDateFilter: () => void;
  filteredCount: number;
  totalCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearDateFilter,
  filteredCount,
  totalCount,
}) => {
  const [isDateOpenMobile, setIsDateOpenMobile] = useState(false);

  const hasDateFilter = Boolean(startDate || endDate);

  const handleStartDate = (val: string) => {
    onStartDateChange(val);
    if (val && endDate && val > endDate) {
      onEndDateChange(val);
    }
  };

  const handleEndDate = (val: string) => {
    onEndDateChange(val);
    if (val && startDate && val < startDate) {
      onStartDateChange(val);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle mb-6 divide-y divide-slate-100">
      {/* Top Row: Search Input, Department Dropdown & Mobile Dates Toggle */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, or role..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls Section: Department Dropdown & Mobile Date Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Department Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full sm:w-auto pl-8 pr-8 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none cursor-pointer transition-colors shadow-xs"
              aria-label="Filter by Department"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="HR">HR & Operations</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile Date Filter Toggle Button */}
          <button
            onClick={() => setIsDateOpenMobile((prev) => !prev)}
            className={`lg:hidden px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              hasDateFilter
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            aria-label="Toggle Date Filter"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dates</span>
            {hasDateFilter && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
            {isDateOpenMobile ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Date Selector Filter Bar (Visible on Desktop, Collapsible/Expandable on Mobile) */}
      <div
        className={`${
          isDateOpenMobile ? 'block' : 'hidden'
        } lg:block px-4 py-3 bg-slate-50/60 transition-all`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Joined Date Range:</span>
            </div>

            {/* From Date Input */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
              />
            </div>

            {/* To Date Input */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs"
              />
            </div>

            {/* Reset / Clear Button */}
            {hasDateFilter && (
              <button
                onClick={onClearDateFilter}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium border border-rose-200 transition-colors"
                title="Reset date filter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Dates</span>
              </button>
            )}
          </div>

          {/* Result Count Info */}
          <div className="text-xs text-slate-500 flex items-center justify-between sm:justify-end gap-2">
            <span>
              Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount} employees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
