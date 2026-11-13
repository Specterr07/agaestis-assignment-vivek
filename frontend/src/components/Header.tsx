import React from 'react';
import { UserPlus, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export interface HeaderProps {
  totalEmployees: number;
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalEmployees, onAddClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Ágaetis Directory
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {totalEmployees} Members
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage, search, and organize company talent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onAddClick}
              className="shadow-sm hover:shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
