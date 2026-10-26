import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Calendar, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { calculateHistogram, calculateDescriptive } from '../utils/statistics';

export const HomeView: React.FC = () => {
  const { setActiveTab, allRecords, mathRecords, porRecords } = useData();

  // Real statistics calculated directly from the active dataset
  const mathStats = useMemo(() => calculateDescriptive(mathRecords.map(r => r.G3)), [mathRecords]);
  const porStats = useMemo(() => calculateDescriptive(porRecords.map(r => r.G3)), [porRecords]);
  const combinedStats = useMemo(() => calculateDescriptive(allRecords.map(r => r.G3)), [allRecords]);

  // Average absences across dataset
  const avgAbsences = useMemo(() => {
    return (allRecords.reduce((acc, r) => acc + r.absences, 0) / allRecords.length).toFixed(2);
  }, [allRecords]);

  // Average failure incidence
  const avgFailures = useMemo(() => {
    return (allRecords.reduce((acc, r) => acc + r.failures, 0) / allRecords.length).toFixed(2);
  }, [allRecords]);

  // Final grade distribution (0 to 20 bins)
  const gradeDistributionData = useMemo(() => {
    return calculateHistogram(allRecords, 'G3', 0, 20);
  }, [allRecords]);

  // Trimester progression (G1 -> G2 -> G3) for Math and Portuguese
  const progressionData = useMemo(() => {
    const mean = (arr: number[]) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));

    return [
      {
        period: 'G1',
        Mathematics: mean(mathRecords.map(r => r.G1)),
        Portuguese: mean(porRecords.map(r => r.G1)),
      },
      {
        period: 'G2',
        Mathematics: mean(mathRecords.map(r => r.G2)),
        Portuguese: mean(porRecords.map(r => r.G2)),
      },
      {
        period: 'G3',
        Mathematics: mean(mathRecords.map(r => r.G3)),
        Portuguese: mean(porRecords.map(r => r.G3)),
      },
    ];
  }, [mathRecords, porRecords]);

  return (
    <div className="space-y-16">
      {/* 1. Full-Width Editorial Split Hero */}
      <section className="pt-2 sm:pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (55% width) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase font-bold tracking-[0.2em] text-[#74766F]">
              DATA ANALYSIS PROJECT
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#26342E] leading-[1.08] tracking-tight">
              Student Performance<br />
              <span className="text-[#D95D24]">Analysis</span>
            </h1>

            <p className="text-base sm:text-lg text-[#74766F] leading-relaxed max-w-xl">
              Exploring the factors that influence student academic performance in Mathematics and Portuguese, using real-world educational data.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className="flex items-center space-x-2 px-6 py-3 bg-[#D95D24] hover:bg-[#C24F1D] text-white text-sm font-semibold rounded-md transition-colors shadow-xs"
              >
                <span>View Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('dataset')}
                className="px-6 py-3 bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#E8E4DB] text-[#26342E] text-sm font-medium rounded-md transition-colors"
              >
                About Dataset
              </button>
            </div>

            {/* Genuine Dataset Stats Strip (Divided row, no floating cards) */}
            <div className="pt-6 border-t border-[#E8E4DB] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#26342E]">
                  {allRecords.length.toLocaleString()}
                </div>
                <div className="text-xs text-[#74766F] mt-0.5 font-medium">Total Records</div>
              </div>

              <div className="sm:border-l sm:border-[#E8E4DB] sm:pl-4">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#26342E]">
                  33
                </div>
                <div className="text-xs text-[#74766F] mt-0.5 font-medium">Features</div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l sm:border-[#E8E4DB] pt-3 sm:pt-0 sm:pl-4">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#26342E]">
                  2
                </div>
                <div className="text-xs text-[#74766F] mt-0.5 font-medium">Subjects</div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l sm:border-[#E8E4DB] pt-3 sm:pt-0 sm:pl-4">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#26342E]">
                  3
                </div>
                <div className="text-xs text-[#74766F] mt-0.5 font-medium">Grade Periods</div>
              </div>
            </div>
          </div>

          {/* Right Column (45% width) - Custom Generated Student Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8E4DB] shadow-sm bg-[#F4D4BD]/20">
              <img
                src="/images/student-hero.png"
                alt="Student walking toward university building with books and backpack"
                className="w-full h-auto object-cover max-h-[460px]"
                loading="eager"
              />
              {/* Subtle Editorial Overlay Banner */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded text-[11px] font-heading italic text-[#26342E] shadow-xs border border-[#E8E4DB]">
                Better Students · Brighter Futures
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Insights / Key Findings Section */}
      <section className="space-y-6 pt-6 border-t border-[#E8E4DB]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#74766F]">
            QUICK INSIGHTS
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#26342E] mt-1">
            Key <span className="text-[#D95D24]">Findings</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#74766F] mt-1">
            A quick look at what the data reveals about student performance, study habits, and important academic factors.
          </p>
        </div>

        {/* 4 Metric Tiles (Matching Reference Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#E8E4DB] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-heading text-2xl font-bold text-[#26342E]">
                {combinedStats.mean}
              </div>
              <div className="text-xs text-[#74766F] mt-0.5">Average Final Grade (G3)</div>
            </div>
            <div className="w-8 h-8 rounded bg-[#DCE5D8] flex items-center justify-center text-[#173B32]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E8E4DB] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-heading text-2xl font-bold text-[#26342E]">
                4.5h
              </div>
              <div className="text-xs text-[#74766F] mt-0.5">Average Study Time</div>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4D4BD] flex items-center justify-center text-[#D95D24]">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E8E4DB] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-heading text-2xl font-bold text-[#26342E]">
                {avgAbsences}
              </div>
              <div className="text-xs text-[#74766F] mt-0.5">Average Absences (days)</div>
            </div>
            <div className="w-8 h-8 rounded bg-[#E8C779]/30 flex items-center justify-center text-[#946F19]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E8E4DB] rounded-lg flex items-center justify-between">
            <div>
              <div className="font-heading text-2xl font-bold text-[#26342E]">
                {avgFailures}
              </div>
              <div className="text-xs text-[#74766F] mt-0.5">Average Past Failures</div>
            </div>
            <div className="w-8 h-8 rounded bg-[#F4D4BD] flex items-center justify-center text-[#D95D24]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 3. Two Side-by-Side Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Final Grade Distribution */}
          <div className="bg-white p-5 rounded-lg border border-[#E8E4DB] space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#26342E]">
                Final Grade Distribution
              </h3>
              <p className="text-xs text-[#74766F]">
                Distribution of student marks across the full 0 to 20 Portuguese grading scale.
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                  <XAxis 
                    dataKey="binLabel" 
                    stroke="#74766F" 
                    tick={{ fontSize: 11, fill: '#74766F' }} 
                  />
                  <YAxis 
                    stroke="#74766F" 
                    tick={{ fontSize: 11, fill: '#74766F' }} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-[#E8E4DB] p-2.5 rounded shadow-xs text-xs">
                            <p className="font-semibold text-[#26342E]">Grade: {data.binLabel} / 20</p>
                            <p className="text-[#D95D24]">Students: {data.count} ({data.density}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" name="Students" fill="#D95D24" radius={[2, 2, 0, 0]} opacity={0.88} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mathematics vs Portuguese Performance Line Chart */}
          <div className="bg-white p-5 rounded-lg border border-[#E8E4DB] space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#26342E]">
                Mathematics vs Portuguese Performance
              </h3>
              <p className="text-xs text-[#74766F]">
                Trimester average marks progression across G1, G2, and final G3 evaluations.
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis dataKey="period" stroke="#74766F" tick={{ fontSize: 12, fill: '#74766F' }} />
                  <YAxis domain={[0, 20]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E4DB', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="Mathematics" 
                    stroke="#D95D24" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#D95D24' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Portuguese" 
                    stroke="#173B32" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#173B32' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
