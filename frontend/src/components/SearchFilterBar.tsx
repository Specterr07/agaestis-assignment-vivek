import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  filteredCount,
  totalCount,
}) => {
  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'HR'];

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-subtle mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name, email, or role..."
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

      {/* Department Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="flex items-center gap-1 text-xs text-slate-400 mr-1 hidden sm:flex">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {departments.map((dept) => {
          const isActive = selectedDepartment.toUpperCase() === dept.toUpperCase();
          return (
            <button
              key={dept}
              onClick={() => onDepartmentChange(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {dept === 'ALL' ? 'All Roles' : dept}
            </button>
          );
        })}

        <span className="text-xs text-slate-400 ml-2 hidden lg:inline">
          ({filteredCount} of {totalCount})
        </span>
      </div>
    </div>
  );
};
