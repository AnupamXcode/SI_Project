import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ArrowRight } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { setActiveTab, mathRecords, porRecords, allRecords } = useData();

  // Overview distribution chart: grade brackets for both subjects
  const overviewDistribution = useMemo(() => {
    const brackets = [
      { label: '0–9 (Fail)', min: 0, max: 9 },
      { label: '10–13 (Pass)', min: 10, max: 13 },
      { label: '14–15 (Good)', min: 14, max: 15 },
      { label: '16–20 (Distinction)', min: 16, max: 20 },
    ];

    return brackets.map(b => {
      const mathCount = mathRecords.filter(r => r.G3 >= b.min && r.G3 <= b.max).length;
      const porCount = porRecords.filter(r => r.G3 >= b.min && r.G3 <= b.max).length;
      return {
        bracket: b.label,
        Mathematics: mathCount,
        Portuguese: porCount,
        mathPct: ((mathCount / mathRecords.length) * 100).toFixed(1),
        porPct: ((porCount / porRecords.length) * 100).toFixed(1),
      };
    });
  }, [mathRecords, porRecords]);

  return (
    <div className="space-y-12">
      {/* Title & Introduction */}
      <section className="pt-4 pb-2 max-w-3xl">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292D28] tracking-tight mb-4">
          Student Performance Analysis
        </h1>
        <p className="text-base text-[#77776F] leading-relaxed">
          This project studies student academic outcomes and investigates the relationships between final grades, weekly study habits, school attendance, previous academic failures, and family contextual factors. All analysis is conducted using observational records from secondary school students in Portugal.
        </p>
      </section>

      {/* Dataset Summary Strip (Flat, clean, no oversized cards) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E8E4DB]">
        <div>
          <div className="text-xs text-[#77776F] uppercase tracking-wider font-medium">Total Records</div>
          <div className="font-heading text-2xl font-bold text-[#292D28] mt-1">
            {allRecords.length.toLocaleString()}
          </div>
          <div className="text-xs text-[#77776F] mt-0.5">395 Math · 649 Portuguese</div>
        </div>

        <div>
          <div className="text-xs text-[#77776F] uppercase tracking-wider font-medium">Recorded Features</div>
          <div className="font-heading text-2xl font-bold text-[#292D28] mt-1">33</div>
          <div className="text-xs text-[#77776F] mt-0.5">Academic, social & habits</div>
        </div>

        <div>
          <div className="text-xs text-[#77776F] uppercase tracking-wider font-medium">Subject Cohorts</div>
          <div className="font-heading text-2xl font-bold text-[#292D28] mt-1">2</div>
          <div className="text-xs text-[#77776F] mt-0.5">Mathematics & Portuguese</div>
        </div>

        <div>
          <div className="text-xs text-[#77776F] uppercase tracking-wider font-medium">Grading System</div>
          <div className="font-heading text-2xl font-bold text-[#292D28] mt-1">0 – 20</div>
          <div className="text-xs text-[#77776F] mt-0.5">Portuguese statutory scale (Pass ≥ 10)</div>
        </div>
      </section>

      {/* Core Overview Chart */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#292D28]">
            Grade Distribution by Subject
          </h2>
          <p className="text-xs text-[#77776F]">
            Comparison of student counts across statutory achievement bands for Mathematics (395 records) and Portuguese (649 records).
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewDistribution} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                <XAxis 
                  dataKey="bracket" 
                  stroke="#77776F" 
                  tick={{ fontSize: 12, fill: '#77776F' }} 
                />
                <YAxis 
                  stroke="#77776F" 
                  tick={{ fontSize: 12, fill: '#77776F' }} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#E8E4DB] p-3 rounded shadow-xs text-xs">
                          <p className="font-semibold text-[#292D28] mb-1.5">{data.bracket}</p>
                          <p className="text-[#C77D60]">Mathematics: {data.Mathematics} students ({data.mathPct}%)</p>
                          <p className="text-[#456B52]">Portuguese: {data.Portuguese} students ({data.porPct}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Bar dataKey="Mathematics" fill="#C77D60" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Portuguese" fill="#456B52" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Key Analytical Findings (Real Data Calculations) */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#292D28]">
          Key Findings from the Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white border border-[#E8E4DB] rounded-lg">
            <div className="text-xs font-semibold text-[#456B52] uppercase tracking-wider mb-1">
              01 · Discipline Differences
            </div>
            <h3 className="font-medium text-base text-[#292D28] mb-1.5">
              Portuguese marks are consistently higher and less volatile than Mathematics
            </h3>
            <p className="text-xs text-[#77776F] leading-relaxed">
              Portuguese students have an average final grade of <strong>11.91 / 20</strong> (pass rate 84.6%) with a narrow spread (σ = 3.23). In contrast, Mathematics students average <strong>10.42 / 20</strong> (pass rate 67.1%) with significantly wider dispersion (σ = 4.58).
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E8E4DB] rounded-lg">
            <div className="text-xs font-semibold text-[#456B52] uppercase tracking-wider mb-1">
              02 · Assessment Continuity
            </div>
            <h3 className="font-medium text-base text-[#292D28] mb-1.5">
              Early academic marks strongly determine final outcomes
            </h3>
            <p className="text-xs text-[#77776F] leading-relaxed">
              First-trimester (G1) and second-trimester (G2) grades correlate strongly with final examination marks (G3) at <strong>r &gt; 0.85</strong>. Performance trajectories stabilize early in the school year, indicating that mid-year shifts are relatively rare.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E8E4DB] rounded-lg">
            <div className="text-xs font-semibold text-[#C77D60] uppercase tracking-wider mb-1">
              03 · Academic History
            </div>
            <h3 className="font-medium text-base text-[#292D28] mb-1.5">
              Previous class failures exhibit the strongest negative association
            </h3>
            <p className="text-xs text-[#77776F] leading-relaxed">
              Students with zero past class failures average <strong>11.5 / 20</strong>. Students with 1 failure average 8.8, and those with 3 or more failures average only <strong>6.0 / 20</strong>, representing the single largest penalty factor in the dataset.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E8E4DB] rounded-lg">
            <div className="text-xs font-semibold text-[#C77D60] uppercase tracking-wider mb-1">
              04 · Data Nuance
            </div>
            <h3 className="font-medium text-base text-[#292D28] mb-1.5">
              Zero-grade records represent examination absence or withdrawal
            </h3>
            <p className="text-xs text-[#77776F] leading-relaxed">
              Exactly 38 Math students (9.6%) and 15 Portuguese students (2.3%) have G3 = 0. An inspection of their earlier records reveals positive G1 and G2 grades, demonstrating that final zeros reflect missed exams or course withdrawal rather than zero knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Clear Navigation Options */}
      <section className="pt-6 border-t border-[#E8E4DB] flex flex-wrap gap-4 items-center justify-between">
        <span className="text-xs text-[#77776F]">
          Explore the detailed statistical analysis:
        </span>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('performance')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#456B52] hover:bg-[#385642] text-white text-xs font-medium rounded transition-colors"
          >
            <span>Performance Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('factors')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-[#E8E4DB] hover:border-[#456B52] text-[#292D28] text-xs font-medium rounded transition-colors"
          >
            <span>Factors & Relationships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-[#E8E4DB] hover:border-[#456B52] text-[#292D28] text-xs font-medium rounded transition-colors"
          >
            <span>Browse Dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
