import React from 'react';
import { useData } from '../../context/DataContext';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters, resetFilters, filteredRecords, allRecords } = useData();

  if (!isOpen) return null;

  const handleStudyTimeToggle = (level: number) => {
    setFilters(prev => {
      const exists = prev.studytime.includes(level);
      const next = exists 
        ? prev.studytime.filter(s => s !== level)
        : [...prev.studytime, level].sort();
      return { ...prev, studytime: next.length > 0 ? next : [level] };
    });
  };

  const handleFailureToggle = (val: number) => {
    setFilters(prev => {
      const exists = prev.failures.includes(val);
      const next = exists
        ? prev.failures.filter(f => f !== val)
        : [...prev.failures, val].sort();
      return { ...prev, failures: next.length > 0 ? next : [val] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17382B]/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FFFDF9] border-l border-[#DCD6C8] shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-5 border-b border-[#E6E0D2] flex items-center justify-between bg-[#F7F4EC]">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C55A38]" />
              <h3 className="font-serif-editorial text-lg font-bold text-[#17382B]">
                Analytical Cohort Filters
              </h3>
            </div>
            <p className="text-xs text-[#68736B] mt-0.5">
              Active: <strong className="text-[#17382B]">{filteredRecords.length}</strong> of {allRecords.length} records
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#68736B] hover:text-[#17382B] hover:bg-[#EAE5D7] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-[#4A5851]">
          {/* Grade Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-[#17382B] uppercase tracking-wider text-[11px]">
                Final Grade Range (G3)
              </label>
              <span className="font-mono-data text-[#C55A38] font-bold">
                {filters.gradeRange[0]} — {filters.gradeRange[1]} / 20
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="20"
                value={filters.gradeRange[0]}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFilters(prev => ({
                    ...prev,
                    gradeRange: [Math.min(val, prev.gradeRange[1]), prev.gradeRange[1]]
                  }));
                }}
                className="w-full accent-[#17382B]"
              />
              <input
                type="range"
                min="0"
                max="20"
                value={filters.gradeRange[1]}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFilters(prev => ({
                    ...prev,
                    gradeRange: [prev.gradeRange[0], Math.max(val, prev.gradeRange[0])]
                  }));
                }}
                className="w-full accent-[#17382B]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#8FA58A] mt-1">
              <span>0 (Minimum / Incomplete)</span>
              <span>10 (Passing standard)</span>
              <span>20 (Maximum)</span>
            </div>
          </div>

          {/* School Selector */}
          <div>
            <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-2">
              Institution / School
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Schools' },
                { id: 'GP', label: 'Gabriel Pereira (GP)' },
                { id: 'MS', label: 'Mousinho da Silveira (MS)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilters(prev => ({ ...prev, school: opt.id as any }))}
                  className={`p-2 rounded-lg text-center font-medium border transition-all ${
                    filters.school === opt.id
                      ? 'bg-[#17382B] text-white border-[#17382B]'
                      : 'bg-white border-[#E0DACB] text-[#5A6861] hover:bg-[#F5F2E9]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Study Time */}
          <div>
            <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-2">
              Weekly Study Time Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 1, label: '< 2 hours/week' },
                { val: 2, label: '2 to 5 hours/week' },
                { val: 3, label: '5 to 10 hours/week' },
                { val: 4, label: '> 10 hours/week' }
              ].map(item => {
                const isSelected = filters.studytime.includes(item.val);
                return (
                  <button
                    key={item.val}
                    onClick={() => handleStudyTimeToggle(item.val)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left font-medium transition-all ${
                      isSelected
                        ? 'bg-[#17382B]/10 border-[#17382B] text-[#17382B]'
                        : 'bg-white border-[#E0DACB] text-[#7A867F] hover:bg-[#F5F2E9]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#17382B]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Previous Failures */}
          <div>
            <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-2">
              Past Class Failures
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(val => {
                const isSelected = filters.failures.includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => handleFailureToggle(val)}
                    className={`p-2 rounded-lg border text-center font-mono-data font-bold transition-all ${
                      isSelected
                        ? 'bg-[#C55A38] text-white border-[#C55A38]'
                        : 'bg-white border-[#E0DACB] text-[#5A6861] hover:bg-[#F5F2E9]'
                    }`}
                  >
                    {val === 3 ? '3+ failures' : `${val} failures`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Absences Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#17382B] uppercase tracking-wider text-[11px]">
                Maximum Absences Filter
              </label>
              <span className="font-mono-data text-[#17382B] font-bold">
                ≤ {filters.absencesRange[1]} days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="93"
              value={filters.absencesRange[1]}
              onChange={e => {
                const val = Number(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  absencesRange: [0, val]
                }));
              }}
              className="w-full accent-[#C55A38]"
            />
          </div>

          {/* Support and Contextual Attributes */}
          <div className="space-y-3 pt-2 border-t border-[#EAE5D7]">
            <div>
              <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-1.5">
                Extra School Support (schoolsup)
              </label>
              <div className="flex gap-2">
                {['all', 'yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, schoolsup: opt as any }))}
                    className={`flex-1 py-1.5 rounded-md border text-center capitalize font-medium ${
                      filters.schoolsup === opt
                        ? 'bg-[#17382B] text-white border-[#17382B]'
                        : 'bg-white border-[#E0DACB] text-[#5A6861]'
                    }`}
                  >
                    {opt === 'all' ? 'All' : opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-1.5">
                Internet Access at Home
              </label>
              <div className="flex gap-2">
                {['all', 'yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, internet: opt as any }))}
                    className={`flex-1 py-1.5 rounded-md border text-center capitalize font-medium ${
                      filters.internet === opt
                        ? 'bg-[#17382B] text-white border-[#17382B]'
                        : 'bg-white border-[#E0DACB] text-[#5A6861]'
                    }`}
                  >
                    {opt === 'all' ? 'All' : opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17382B] uppercase tracking-wider text-[11px] mb-1.5">
                Higher Education Aspirations
              </label>
              <div className="flex gap-2">
                {['all', 'yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, higher: opt as any }))}
                    className={`flex-1 py-1.5 rounded-md border text-center capitalize font-medium ${
                      filters.higher === opt
                        ? 'bg-[#17382B] text-white border-[#17382B]'
                        : 'bg-white border-[#E0DACB] text-[#5A6861]'
                    }`}
                  >
                    {opt === 'all' ? 'All' : opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E6E0D2] bg-[#F7F4EC] flex items-center justify-between">
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#C55A38] hover:bg-[#EAE4D5] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#17382B] hover:bg-[#224E3D] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Apply Filters ({filteredRecords.length})
          </button>
        </div>
      </div>
    </div>
  );
};
