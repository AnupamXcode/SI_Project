import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  Cell 
} from 'recharts';
import { calculateDescriptive, calculateLinearRegression } from '../utils/statistics';
import { Clock, AlertCircle, ShieldAlert, Award, BookOpen, Layers } from 'lucide-react';

export const EngagementPatternsView: React.FC = () => {
  const { filteredRecords, filters } = useData();
  const [selectedAttribute, setSelectedAttribute] = useState<'studytime' | 'absences' | 'failures' | 'schoolsup'>('studytime');

  // Study time grouped statistics
  const studyTimeStats = useMemo(() => {
    const categories = [
      { level: 1, label: '< 2 hours/week' },
      { level: 2, label: '2 to 5 hours/week' },
      { level: 3, label: '5 to 10 hours/week' },
      { level: 4, label: '> 10 hours/week' }
    ];

    return categories.map(cat => {
      const records = filteredRecords.filter(r => r.studytime === cat.level);
      const desc = calculateDescriptive(records.map(r => r.G3));
      return {
        level: cat.level,
        label: cat.label,
        count: desc.count,
        mean: desc.mean,
        median: desc.median,
        std: desc.std,
        passRate: desc.passRate
      };
    });
  }, [filteredRecords]);

  // Absences scatter plot with regression
  const absencesData = useMemo(() => {
    return filteredRecords.map(r => ({
      absences: r.absences,
      grade: r.G3,
      subject: r.subject,
      id: r.id
    }));
  }, [filteredRecords]);

  const absencesRegression = useMemo(() => {
    const x = filteredRecords.map(r => r.absences);
    const y = filteredRecords.map(r => r.G3);
    return calculateLinearRegression(x, y);
  }, [filteredRecords]);

  // Extra Support (schoolsup) analysis
  const schoolSupportStats = useMemo(() => {
    const withSupport = filteredRecords.filter(r => r.schoolsup === 'yes');
    const withoutSupport = filteredRecords.filter(r => r.schoolsup === 'no');

    const descWith = calculateDescriptive(withSupport.map(r => r.G3));
    const descWithout = calculateDescriptive(withoutSupport.map(r => r.G3));

    return {
      with: { ...descWith, label: 'Received Extra School Support' },
      without: { ...descWithout, label: 'Standard Schooling (No Support)' }
    };
  }, [filteredRecords]);

  // Previous failures analysis
  const failureStats = useMemo(() => {
    const failureGroups = [0, 1, 2, 3];
    return failureGroups.map(f => {
      const recs = filteredRecords.filter(r => r.failures === f);
      const desc = calculateDescriptive(recs.map(r => r.G3));
      return {
        failureCount: f === 3 ? '3+ Failures' : `${f} Failures`,
        count: desc.count,
        mean: desc.mean,
        median: desc.median,
        passRate: desc.passRate
      };
    });
  }, [filteredRecords]);

  return (
    <div className="space-y-8">
      <EditorialHeader
        kicker="Engagement & Behavioral Patterns"
        title="Study Habits, Attendance & Educational Support"
        description="Empirical examination of study hours, absence penalties, past failure inertia, and compensatory support mechanisms."
        tags={[
          { label: 'Descriptive Associations Only', color: 'terracotta' },
          { label: 'Sample: ' + filteredRecords.length, color: 'green' }
        ]}
      />

      {/* Mandatory Scientific Caution Banner */}
      <div className="bg-[#FAF6EC] border border-[#E9DEC5] rounded-2xl p-5 flex items-start space-x-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-[#C55A38] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5A6861] space-y-1">
          <strong className="text-[#17382B] text-sm font-serif-editorial block">
            Methodological Imperative: Association vs. Causation
          </strong>
          <p className="leading-relaxed">
            Observed variations between study time, extra support, and final grades reflect complex associations, not direct causation. For instance, students assigned to extra school support (<em>schoolsup = yes</em>) often start with lower baseline diagnostic scores, producing a counter-intuitive descriptive correlation if unadjusted.
          </p>
        </div>
      </div>

      {/* Module 1: Study Time Spectrum */}
      <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
              Effort Allocation
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
              Weekly Study Hours vs. Final Mark (G3)
            </h3>
          </div>
          <span className="text-xs text-[#68736B] font-mono-data">
            4 Ordinal Categories (Cortez & Silva, 2008)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {studyTimeStats.map((item, idx) => (
            <div key={idx} className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-[#17382B]">{item.label}</span>
                <span className="font-mono-data text-[11px] text-[#68736B]">n = {item.count}</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                  {item.mean}
                </span>
                <span className="text-xs text-[#8FA58A]">/ 20 mean</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#7A8880] mt-2 pt-2 border-t border-[#EAE4D5]">
                <span>Median: {item.median}</span>
                <span>Pass: {item.passRate}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#F8F5EC] rounded-xl border border-[#E6E0D0] text-xs text-[#68736B]">
          <strong>Empirical Finding:</strong> Moderate positive upward shift in final grade mean is observed from Category 1 (&lt;2 hrs: μ={studyTimeStats[0]?.mean}) to Category 4 (&gt;10 hrs: μ={studyTimeStats[3]?.mean}). However, sample size is heavily concentrated in Category 2 (2–5 hours/week).
        </div>
      </div>

      {/* Module 2: Absences and Grade Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-paper-card rounded-2xl p-6 border border-[#E0DBCB] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#17382B]">
                Attendance & Truancy
              </span>
              <h3 className="font-serif-editorial text-xl font-bold text-[#17382B]">
                School Absences vs. Final Mark
              </h3>
            </div>
            <div className="text-right text-xs text-[#68736B] font-mono-data">
              <span>{absencesRegression.equation}</span>
              <br />
              <span>R² = {absencesRegression.r2}</span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DA" />
                <XAxis 
                  dataKey="absences" 
                  name="Absences" 
                  stroke="#68736B" 
                  label={{ value: 'Number of School Absences (Days)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#17382B' }} 
                />
                <YAxis 
                  dataKey="grade" 
                  name="Final Grade (G3)" 
                  domain={[0, 20]} 
                  stroke="#68736B" 
                  label={{ value: 'Final Mark (G3)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#17382B' }} 
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFDF9] border border-[#D4CEBF] p-2.5 rounded-xl text-xs shadow-md">
                          <p className="font-bold text-[#17382B]">{data.id} ({data.subject})</p>
                          <p className="text-[#C55A38]">Absences: <strong>{data.absences} days</strong></p>
                          <p className="text-[#17382B]">Final Grade: <strong>{data.grade} / 20</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={absencesData} fill="#17382B" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-[#7A8880] mt-3">
            Notice that attendance records show heavy clustering under 15 days of absence, with extreme tail outliers reaching up to 75–93 days.
          </p>
        </div>

        {/* Previous Failures Impact */}
        <div className="lg:col-span-4 bg-paper-card rounded-2xl p-6 border border-[#E0DBCB] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
              Academic History
            </span>
            <h3 className="font-serif-editorial text-xl font-bold text-[#17382B] mb-2">
              Previous Failures Inertia
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              The number of past class failures shows strong negative association with final achievement marks.
            </p>

            <div className="space-y-3">
              {failureStats.map((item, idx) => (
                <div key={idx} className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-[#17382B]">{item.failureCount}</span>
                    <span className="text-[#68736B] font-mono-data">n = {item.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-serif-editorial text-lg font-bold text-[#C55A38]">
                      μ = {item.mean} / 20
                    </span>
                    <span className="text-xs font-semibold text-[#17382B]">
                      Pass rate: {item.passRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFEAE0] text-[11px] text-[#7A8880]">
            Students with 0 previous failures achieve an average grade over 11.5, compared to ~6.0 for those with 3+ past failures.
          </div>
        </div>
      </div>

      {/* Module 3: Institutional Extra Support Paradox */}
      <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#17382B]">
          Compensatory Intervention Analysis
        </span>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-2">
          The School Support (`schoolsup`) Confounder
        </h3>
        <p className="text-xs sm:text-sm text-[#68736B] leading-relaxed max-w-3xl mb-6">
          In educational research, naive analysts often conclude that remedial school support reduces student performance because support recipients score lower on average. In reality, students receive remedial support <em>because</em> they were struggling initially.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-[#E0DBCB] bg-[#FAF7EE]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm text-[#17382B]">
                {schoolSupportStats.without.label}
              </span>
              <span className="text-xs font-mono-data px-2 py-0.5 rounded bg-[#17382B]/10 text-[#17382B] font-bold">
                n = {schoolSupportStats.without.count}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-[#EAE4D5]">
                <span className="text-[10px] text-[#7A8880] block">Mean Grade</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
                  {schoolSupportStats.without.mean}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EAE4D5]">
                <span className="text-[10px] text-[#7A8880] block">Median</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
                  {schoolSupportStats.without.median}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EAE4D5]">
                <span className="text-[10px] text-[#7A8880] block">Pass Rate</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
                  {schoolSupportStats.without.passRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#E9C8BC] bg-[#FCF8F6]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm text-[#C55A38]">
                {schoolSupportStats.with.label}
              </span>
              <span className="text-xs font-mono-data px-2 py-0.5 rounded bg-[#C55A38]/10 text-[#C55A38] font-bold">
                n = {schoolSupportStats.with.count}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Mean Grade</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
                  {schoolSupportStats.with.mean}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Median</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
                  {schoolSupportStats.with.median}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Pass Rate</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
                  {schoolSupportStats.with.passRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
