import React from 'react';

interface StatMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeColor?: 'green' | 'terracotta' | 'sage' | 'gold' | 'charcoal';
  highlight?: boolean;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  badgeColor = 'green',
  highlight = false,
}) => {
  const badgeClasses = {
    green: 'bg-[#17382B]/10 text-[#17382B] border-[#17382B]/20',
    terracotta: 'bg-[#C55A38]/10 text-[#C55A38] border-[#C55A38]/20',
    sage: 'bg-[#8FA58A]/20 text-[#17382B] border-[#8FA58A]/30',
    gold: 'bg-[#D9A441]/15 text-[#916719] border-[#D9A441]/30',
    charcoal: 'bg-[#1C2923]/10 text-[#1C2923] border-[#1C2923]/20',
  };

  return (
    <div
      className={`rounded-2xl p-5 transition-all ${
        highlight
          ? 'bg-gradient-to-br from-[#17382B] to-[#122A20] text-[#FFFDF7] shadow-md border border-[#17382B]'
          : 'bg-paper-card text-[#1C2923] hover:border-[#D4CEBF] shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-xs font-medium tracking-wide uppercase ${
            highlight ? 'text-[#D0DACB]' : 'text-[#68736B]'
          }`}
        >
          {label}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full font-medium border ${
              highlight
                ? 'bg-[#F7F5EF]/15 text-[#FFFDF7] border-[#F7F5EF]/30'
                : badgeClasses[badgeColor]
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span
          className={`font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight ${
            highlight ? 'text-[#FFFDF7]' : 'text-[#17382B]'
          }`}
        >
          {value}
        </span>
      </div>

      {subtext && (
        <p
          className={`text-xs mt-2 leading-relaxed ${
            highlight ? 'text-[#C7D4C2]' : 'text-[#7D8881]'
          }`}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
