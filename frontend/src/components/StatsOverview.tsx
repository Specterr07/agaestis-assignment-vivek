import React from 'react';
import { Users, Code2, Palette, Layers } from 'lucide-react';

export interface StatsOverviewProps {
  total: number;
  active: number;
  onLeave: number;
  departments: Record<string, number>;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  total,
  active,
  departments,
}) => {
  const cards = [
    {
      label: 'Total Workforce',
      value: total,
      sub: `${active} active currently`,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Engineering',
      value: departments['Engineering'] || 0,
      sub: 'Developers & DevOps',
      icon: Code2,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Design Team',
      value: departments['Design'] || 0,
      sub: 'UI/UX & Product Design',
      icon: Palette,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Product & HR',
      value: (departments['Product'] || 0) + (departments['HR'] || 0),
      sub: 'Leadership & Talent',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-subtle flex items-center justify-between transition-all hover:border-slate-300"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
