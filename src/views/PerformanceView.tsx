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
import { calculateHistogram, calculateDescriptive } from '../utils/statistics';

export const PerformanceView: React.FC = () => {
  const { allRecords, mathRecords, porRecords } = useData();

  // Statistical calculations from actual data
  const mathStats = useMemo(() => calculateDescriptive(mathRecords.map(r => r.G3)), [mathRecords]);
  const porStats = useMemo(() => calculateDescriptive(porRecords.map(r => r.G3)), [porRecords]);
  const combinedStats = useMemo(() => calculateDescriptive(allRecords.map(r => r.G3)), [allRecords]);

  // Full histogram 0 to 20 for integer grading
  const histogramData = useMemo(() => {
    return calculateHistogram(allRecords, 'G3', 0, 20);
  }, [allRecords]);

  // Assessment period G1, G2, G3 progression
  const periodTrends = useMemo(() => {
    const mean = (arr: number[]) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));

    return [
      {
        period: 'Period 1 (G1)',
        Mathematics: mean(mathRecords.map(r => r.G1)),
        Portuguese: mean(porRecords.map(r => r.G1)),
        Overall: mean(allRecords.map(r => r.G1)),
      },
      {
        period: 'Period 2 (G2)',
        Mathematics: mean(mathRecords.map(r => r.G2)),
        Portuguese: mean(porRecords.map(r => r.G2)),
        Overall: mean(allRecords.map(r => r.G2)),
      },
      {
        period: 'Final Grade (G3)',
        Mathematics: mean(mathRecords.map(r => r.G3)),
        Portuguese: mean(porRecords.map(r => r.G3)),
        Overall: mean(allRecords.map(r => r.G3)),
      },
    ];
  }, [allRecords, mathRecords, porRecords]);

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#292D28] tracking-tight mb-2">
          Academic Performance Analysis
        </h1>
        <p className="text-sm text-[#77776F] max-w-3xl leading-relaxed">
          Detailed evaluation of student achievement across the two subject cohorts. The Portuguese educational system evaluates secondary students on a continuous scale from 0 to 20, where 10 is the mandatory passing threshold.
        </p>
      </div>

      {/* Summary Statistics Table */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-[#292D28]">
          Descriptive Grade Summary
        </h2>

        <div className="bg-white border border-[#E8E4DB] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DB] bg-[#FAF8F3] text-[#292D28]">
                <th className="py-3 px-4 font-semibold">Cohort</th>
                <th className="py-3 px-4 font-semibold text-center">Records</th>
                <th className="py-3 px-4 font-semibold text-center">Mean (Average)</th>
                <th className="py-3 px-4 font-semibold text-center">Median</th>
                <th className="py-3 px-4 font-semibold text-center">Std Dev (σ)</th>
                <th className="py-3 px-4 font-semibold text-center">Min – Max</th>
                <th className="py-3 px-4 font-semibold text-center">Pass Rate (≥ 10)</th>
                <th className="py-3 px-4 font-semibold text-center">Zero-Grade Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DB] text-[#292D28]">
              <tr>
                <td className="py-3 px-4 font-medium text-[#C77D60]">Mathematics</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-semibold">{mathStats.mean}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.median}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.std}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.min} – {mathStats.max}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.passRate}%</td>
                <td className="py-3 px-4 text-center font-data text-[#C77D60]">{mathStats.zeroRate}% (38)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#456B52]">Portuguese</td>
                <td className="py-3 px-4 text-center font-data">{porStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-semibold">{porStats.mean}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.median}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.std}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.min} – {porStats.max}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.passRate}%</td>
                <td className="py-3 px-4 text-center font-data text-[#456B52]">{porStats.zeroRate}% (15)</td>
              </tr>
              <tr className="bg-[#FAF8F3]/60 font-medium">
                <td className="py-3 px-4 text-[#292D28]">Combined Overall</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-semibold">{combinedStats.mean}</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.median}</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.std}</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.min} – {combinedStats.max}</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.passRate}%</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.zeroRate}% (53)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Frequency Distribution Chart */}
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#292D28]">
            Final Grade Distribution (Integer Scores 0–20)
          </h2>
          <p className="text-xs text-[#77776F]">
            Exact count of students earning each integer grade mark in Mathematics and Portuguese.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                <XAxis 
                  dataKey="binLabel" 
                  stroke="#77776F" 
                  tick={{ fontSize: 11, fill: '#77776F' }} 
                />
                <YAxis 
                  stroke="#77776F" 
                  tick={{ fontSize: 11, fill: '#77776F' }} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#E8E4DB] p-2.5 rounded shadow-xs text-xs">
                          <p className="font-semibold text-[#292D28] mb-1">Score: {data.binLabel} / 20</p>
                          <p className="text-[#C77D60]">Mathematics: {data.mathCount} students</p>
                          <p className="text-[#456B52]">Portuguese: {data.porCount} students</p>
                          <p className="text-[#77776F] mt-1 pt-1 border-t border-[#E8E4DB]">Total: {data.count} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="mathCount" name="Mathematics" fill="#C77D60" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="porCount" name="Portuguese" fill="#456B52" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[#77776F] mt-3">
            Note the prominent spike at mark 0 (38 in Math, 15 in Portuguese). When excluding zero-marks, both subjects show bell-shaped distributions centered around 11–13.
          </p>
        </div>
      </div>

      {/* Trimester Progression Chart */}
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#292D28]">
            Assessment Progression (G1 → G2 → G3)
          </h2>
          <p className="text-xs text-[#77776F]">
            Tracking average cohort marks across the three sequential evaluation periods throughout the school year.
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={periodTrends} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                <XAxis dataKey="period" stroke="#77776F" tick={{ fontSize: 12, fill: '#77776F' }} />
                <YAxis domain={[8, 14]} stroke="#77776F" tick={{ fontSize: 12, fill: '#77776F' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E4DB', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Portuguese" 
                  stroke="#456B52" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#456B52' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Mathematics" 
                  stroke="#C77D60" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#C77D60' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Overall" 
                  stroke="#292D28" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={{ r: 3, fill: '#292D28' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-[#77776F] mt-3">
            Mean grades remain consistent throughout the year (Mathematics ~10.4–10.9; Portuguese ~11.3–11.9). This stability confirms that student performance brackets are established early in the term.
          </div>
        </div>
      </div>
    </div>
  );
};
