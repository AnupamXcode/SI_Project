import React from 'react';
import { useData } from '../../context/DataContext';
import { X, GraduationCap, Users, Clock, Award, Activity, Heart, BookOpen } from 'lucide-react';

export const StudentDetailModal: React.FC = () => {
  const { selectedStudentRecord, setSelectedStudentRecord } = useData();

  if (!selectedStudentRecord) return null;

  const s = selectedStudentRecord;

  const studyLabels: Record<number, string> = {
    1: '< 2 hours / week',
    2: '2 to 5 hours / week',
    3: '5 to 10 hours / week',
    4: '> 10 hours / week'
  };

  const eduLabels: Record<number, string> = {
    0: 'None',
    1: 'Primary (4th grade)',
    2: '5th to 9th grade',
    3: 'Secondary education',
    4: 'Higher education'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17382B]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedStudentRecord(null)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl border border-[#D8D2C2] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#17382B] to-[#254C3B] text-white flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-[#D9A441]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-editorial text-2xl font-bold tracking-tight">
                  Student Record #{s.id}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  s.subject === 'Mathematics' 
                    ? 'bg-[#C55A38] text-white border-[#C55A38]' 
                    : 'bg-[#D9A441] text-[#17382B] border-[#D9A441]'
                }`}>
                  {s.subject}
                </span>
              </div>
              <p className="text-xs text-[#D8E4DA] mt-0.5">
                School: <strong>{s.school === 'GP' ? 'Gabriel Pereira (GP)' : 'Mousinho da Silveira (MS)'}</strong> · Age {s.age} · {s.sex === 'F' ? 'Female' : 'Male'} · {s.address === 'U' ? 'Urban' : 'Rural'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedStudentRecord(null)}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade Progression Banner */}
        <div className="bg-[#F4EFE2] border-b border-[#E3DC handle-c8] p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736B] block mb-2.5">
            Academic Performance Progression (0–20 Scale)
          </span>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-[#DFD8C7] shadow-xs">
              <span className="text-[11px] text-[#68736B] block">First Period (G1)</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">{s.G1}</span>
              <span className="text-[10px] text-[#8FA58A] block">/ 20</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#DFD8C7] shadow-xs">
              <span className="text-[11px] text-[#68736B] block">Second Period (G2)</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">{s.G2}</span>
              <span className="text-[10px] text-[#8FA58A] block">/ 20</span>
            </div>
            <div className={`p-3 rounded-xl border shadow-xs ${
              s.G3 >= 10 
                ? 'bg-[#17382B]/10 border-[#17382B]/30' 
                : 'bg-[#C55A38]/10 border-[#C55A38]/30'
            }`}>
              <span className="text-[11px] font-bold text-[#17382B] block">Final Outcome (G3)</span>
              <span className={`font-serif-editorial text-3xl font-bold ${s.G3 >= 10 ? 'text-[#17382B]' : 'text-[#C55A38]'}`}>
                {s.G3}
              </span>
              <span className="text-[10px] font-bold text-[#68736B] block">
                {s.G3 >= 10 ? 'Passing Standard Met' : 'Below Passing (0–9)'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Matrix */}
        <div className="p-6 space-y-6 text-xs text-[#4A5851] max-h-[50vh] overflow-y-auto">
          {/* Family and Social Background */}
          <div>
            <div className="flex items-center space-x-2 text-[#17382B] font-bold uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-[#EAE4D5]">
              <Users className="w-3.5 h-3.5 text-[#C55A38]" />
              <span>Family Context & Social Background</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Mother's Education</span>
                <span className="font-semibold text-[#17382B]">{eduLabels[s.Medu] || s.Medu}</span>
                <span className="text-[10px] text-[#68736B] block">Job: {s.Mjob}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Father's Education</span>
                <span className="font-semibold text-[#17382B]">{eduLabels[s.Fedu] || s.Fedu}</span>
                <span className="text-[10px] text-[#68736B] block">Job: {s.Fjob}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Guardian & Status</span>
                <span className="font-semibold text-[#17382B] capitalize">{s.guardian}</span>
                <span className="text-[10px] text-[#68736B] block">Parents: {s.Pstatus === 'T' ? 'Together' : 'Apart'}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Family Relationship</span>
                <span className="font-semibold text-[#17382B]">{s.famrel} / 5</span>
                <span className="text-[10px] text-[#68736B] block">Scale: 1 (bad) - 5 (good)</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Family Educational Support</span>
                <span className={`font-semibold capitalize ${s.famsup === 'yes' ? 'text-[#17382B]' : 'text-[#8FA58A]'}`}>
                  {s.famsup}
                </span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Internet at Home</span>
                <span className={`font-semibold capitalize ${s.internet === 'yes' ? 'text-[#17382B]' : 'text-[#C55A38]'}`}>
                  {s.internet}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Habits and Attendance */}
          <div>
            <div className="flex items-center space-x-2 text-[#17382B] font-bold uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-[#EAE4D5]">
              <Clock className="w-3.5 h-3.5 text-[#17382B]" />
              <span>Study Habits, Support & Attendance</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Weekly Study Time</span>
                <span className="font-semibold text-[#17382B]">{studyLabels[s.studytime]}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">School Absences</span>
                <span className="font-semibold text-[#C55A38] text-base">{s.absences} days</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Previous Class Failures</span>
                <span className="font-semibold text-[#17382B]">{s.failures}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">School Extra Support</span>
                <span className="font-semibold capitalize text-[#17382B]">{s.schoolsup}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Paid Extra Classes</span>
                <span className="font-semibold capitalize text-[#17382B]">{s.paid}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Extracurricular Activities</span>
                <span className="font-semibold capitalize text-[#17382B]">{s.activities}</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Higher Education Goal</span>
                <span className={`font-semibold capitalize ${s.higher === 'yes' ? 'text-[#17382B]' : 'text-[#C55A38]'}`}>
                  {s.higher}
                </span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Nursery School</span>
                <span className="font-semibold capitalize text-[#17382B]">{s.nursery}</span>
              </div>
            </div>
          </div>

          {/* Lifestyle & Health */}
          <div>
            <div className="flex items-center space-x-2 text-[#17382B] font-bold uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-[#EAE4D5]">
              <Heart className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Lifestyle & Health Habits (1–5 Scale)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Free Time</span>
                <span className="font-semibold text-[#17382B]">{s.freetime} / 5</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Going Out With Friends</span>
                <span className="font-semibold text-[#17382B]">{s.goout} / 5</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Workday Alcohol (Dalc)</span>
                <span className="font-semibold text-[#17382B]">{s.Dalc} / 5</span>
              </div>
              <div className="bg-[#FAF7EE] p-2.5 rounded-lg border border-[#E9E2D2]">
                <span className="text-[10px] text-[#7A8880] block">Weekend Alcohol (Walc)</span>
                <span className="font-semibold text-[#17382B]">{s.Walc} / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F4EC] border-t border-[#E3DC handle-c8] flex justify-between items-center text-xs">
          <span className="text-[#7A8880]">
            Observational record from UCI Secondary Education dataset · Anonymous ID
          </span>
          <button
            onClick={() => setSelectedStudentRecord(null)}
            className="px-4 py-1.5 rounded-lg bg-[#17382B] text-white font-medium hover:bg-[#254C3B] transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
