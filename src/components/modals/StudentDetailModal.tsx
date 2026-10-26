import React from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';

export const StudentDetailModal: React.FC = () => {
  const { selectedStudentRecord, setSelectedStudentRecord } = useData();

  if (!selectedStudentRecord) return null;

  const s = selectedStudentRecord;

  const studyLabels: Record<number, string> = {
    1: '< 2 hours/week',
    2: '2 to 5 hours/week',
    3: '5 to 10 hours/week',
    4: '> 10 hours/week',
  };

  const eduLabels: Record<number, string> = {
    0: 'None',
    1: 'Primary (4th grade)',
    2: '5th to 9th grade',
    3: 'Secondary education',
    4: 'Higher education',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#292D28]/30 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedStudentRecord(null)}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-xl bg-white rounded-lg border border-[#E8E4DB] shadow-lg overflow-hidden z-10 text-xs">
        {/* Header */}
        <div className="p-5 bg-[#FAF8F3] border-b border-[#E8E4DB] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading text-lg font-bold text-[#292D28]">
                Student Record #{s.id}
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                s.subject === 'Mathematics' 
                  ? 'bg-[#C77D60]/15 text-[#C77D60]' 
                  : 'bg-[#456B52]/15 text-[#456B52]'
              }`}>
                {s.subject}
              </span>
            </div>
            <p className="text-[11px] text-[#77776F] mt-0.5">
              School: <strong>{s.school === 'GP' ? 'Gabriel Pereira' : 'Mousinho da Silveira'}</strong> · Age {s.age} · {s.sex === 'F' ? 'Female' : 'Male'} · {s.address === 'U' ? 'Urban' : 'Rural'}
            </p>
          </div>

          <button
            onClick={() => setSelectedStudentRecord(null)}
            className="p-1 rounded text-[#77776F] hover:text-[#292D28] hover:bg-[#E8E4DB]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trimester Grades Strip */}
        <div className="p-4 border-b border-[#E8E4DB] bg-white">
          <div className="text-[11px] font-medium text-[#77776F] uppercase tracking-wider mb-2">
            Assessment Marks (0–20 Scale)
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
              <span className="text-[10px] text-[#77776F] block">Period 1 (G1)</span>
              <span className="font-data text-lg font-bold text-[#292D28]">{s.G1}</span>
            </div>
            <div className="p-2.5 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
              <span className="text-[10px] text-[#77776F] block">Period 2 (G2)</span>
              <span className="font-data text-lg font-bold text-[#292D28]">{s.G2}</span>
            </div>
            <div className={`p-2.5 rounded border ${s.G3 >= 10 ? 'bg-[#DCE8D8]/40 border-[#456B52]/30' : 'bg-[#C77D60]/10 border-[#C77D60]/30'}`}>
              <span className="text-[10px] text-[#77776F] block font-medium">Final Mark (G3)</span>
              <span className={`font-data text-xl font-bold ${s.G3 >= 10 ? 'text-[#456B52]' : 'text-[#C77D60]'}`}>
                {s.G3}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Attributes */}
        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto text-[#292D28]">
          {/* Study & Schooling */}
          <div>
            <div className="font-medium text-[11px] text-[#77776F] uppercase tracking-wider mb-2">
              Habits & Attendance
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Study Time</span>
                <span className="font-medium">{studyLabels[s.studytime]}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Absences</span>
                <span className="font-medium font-data text-[#C77D60]">{s.absences} days</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Past Failures</span>
                <span className="font-medium font-data">{s.failures}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Extra School Support</span>
                <span className="font-medium capitalize">{s.schoolsup}</span>
              </div>
            </div>
          </div>

          {/* Family & Social */}
          <div>
            <div className="font-medium text-[11px] text-[#77776F] uppercase tracking-wider mb-2">
              Family & Background
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Mother's Education</span>
                <span className="font-medium">{eduLabels[s.Medu] || s.Medu}</span>
                <span className="text-[#77776F] text-[10px] block">Job: {s.Mjob}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Father's Education</span>
                <span className="font-medium">{eduLabels[s.Fedu] || s.Fedu}</span>
                <span className="text-[#77776F] text-[10px] block">Job: {s.Fjob}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Home Internet</span>
                <span className="font-medium capitalize">{s.internet}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Higher Education Goal</span>
                <span className="font-medium capitalize">{s.higher}</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Family Relations</span>
                <span className="font-medium font-data">{s.famrel} / 5</span>
              </div>
              <div className="p-2 bg-[#FAF8F3] rounded border border-[#E8E4DB]">
                <span className="text-[#77776F] block">Parents Status</span>
                <span className="font-medium">{s.Pstatus === 'T' ? 'Together' : 'Apart'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F3] border-t border-[#E8E4DB] flex justify-end">
          <button
            onClick={() => setSelectedStudentRecord(null)}
            className="px-4 py-1.5 bg-[#292D28] hover:bg-[#456B52] text-white rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
