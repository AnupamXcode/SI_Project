import React from 'react';

interface EditorialHeaderProps {
  kicker: string;
  title: string;
  description: string;
  tags?: { label: string; color?: 'green' | 'terracotta' | 'sage' | 'gold' }[];
  children?: React.ReactNode;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  kicker,
  title,
  description,
  tags,
  children
}) => {
  const tagStyles = {
    green: 'bg-[#17382B]/10 text-[#17382B] border-[#17382B]/20',
    terracotta: 'bg-[#C55A38]/10 text-[#C55A38] border-[#C55A38]/20',
    sage: 'bg-[#8FA58A]/20 text-[#17382B] border-[#8FA58A]/30',
    gold: 'bg-[#D9A441]/15 text-[#886214] border-[#D9A441]/30'
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E3D8]">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C55A38]">
              {kicker}
            </span>
            {tags && tags.map((t, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full border font-medium ${tagStyles[t.color || 'green']}`}
              >
                {t.label}
              </span>
            ))}
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#17382B] font-bold tracking-tight mb-2.5">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-[#5A6861] leading-relaxed">
            {description}
          </p>
        </div>

        {children && (
          <div className="flex items-center gap-2 self-start md:self-end shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
