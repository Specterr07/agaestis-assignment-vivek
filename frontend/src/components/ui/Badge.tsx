import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'slate';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  dot = false,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-800 border-rose-200/60',
    blue: 'bg-blue-50 text-blue-800 border-blue-200/60',
    purple: 'bg-purple-50 text-purple-800 border-purple-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};

export const DepartmentBadge: React.FC<{ department: string }> = ({ department }) => {
  const deptLower = department?.toLowerCase() || '';

  if (deptLower.includes('eng') || deptLower.includes('tech') || deptLower.includes('dev')) {
    return <Badge variant="blue">{department}</Badge>;
  }
  if (deptLower.includes('design') || deptLower.includes('ux') || deptLower.includes('ui')) {
    return <Badge variant="purple">{department}</Badge>;
  }
  if (deptLower.includes('prod')) {
    return <Badge variant="amber">{department}</Badge>;
  }
  if (deptLower.includes('hr') || deptLower.includes('talent') || deptLower.includes('people')) {
    return <Badge variant="emerald">{department}</Badge>;
  }

  return <Badge variant="slate">{department}</Badge>;
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'ACTIVE') {
    return (
      <Badge variant="emerald" dot>
        Active
      </Badge>
    );
  }
  if (status === 'ON_LEAVE') {
    return (
      <Badge variant="amber" dot>
        On Leave
      </Badge>
    );
  }
  return <Badge variant="rose">Terminated</Badge>;
};
