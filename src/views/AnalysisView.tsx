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

export const AnalysisView: React.FC = () => {
  const { allRecords, mathRecords, porRecords } = useData();

  // Descriptive statistics for Math, Por, and Combined
  const mathStats = useMemo(() => calculateDescriptive(mathRecords.map(r => r.G3)), [mathRecords]);
  const porStats = useMemo(() => calculateDescriptive(porRecords.map(r => r.G3)), [porRecords]);
  const combinedStats = useMemo(() => calculateDescriptive(allRecords.map(r => r.G3)), [allRecords]);

  // Grade frequency histogram (0 to 20 scale)
  const histogramData = useMemo(() => {
    return calculateHistogram(allRecords, 'G3', 0, 20);
  }, [allRecords]);

  // Trimester progression (G1, G2, G3)
  const progressionData = useMemo(() => {
    const mean = (arr: number[]) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));

    return [
      {
        period: 'Period 1 (G1)',
        Mathematics: mean(mathRecords.map(r => r.G1)),
        Portuguese: mean(porRecords.map(r => r.G1)),
        Combined: mean(allRecords.map(r => r.G1)),
      },
      {
        period: 'Period 2 (G2)',
        Mathematics: mean(mathRecords.map(r => r.G2)),
        Portuguese: mean(porRecords.map(r => r.G2)),
        Combined: mean(allRecords.map(r => r.G2)),
      },
      {
        period: 'Final Evaluation (G3)',
        Mathematics: mean(mathRecords.map(r => r.G3)),
        Portuguese: mean(porRecords.map(r => r.G3)),
        Combined: mean(allRecords.map(r => r.G3)),
      },
    ];
  }, [allRecords, mathRecords, porRecords]);

  // Statutory Grade Bands (Portuguese Secondary Education)
  const statutoryBands = useMemo(() => {
    const bands = [
      { name: 'Fail (0–9)', min: 0, max: 9, description: 'Below minimum pass' },
      { name: 'Suficiente (10–13)', min: 10, max: 13, description: 'Standard pass' },
      { name: 'Bom (14–15)', min: 14, max: 15, description: 'Good achievement' },
      { name: 'Notável / Excelente (16–20)', min: 16, max: 20, description: 'Distinction' }
    ];

    return bands.map(b => {
      const mathCount = mathRecords.filter(r => r.G3 >= b.min && r.G3 <= b.max).length;
      const porCount = porRecords.filter(r => r.G3 >= b.min && r.G3 <= b.max).length;
      const total = mathCount + porCount;

      return {
        band: b.name,
        description: b.description,
        total,
        percentage: ((total / allRecords.length) * 100).toFixed(1),
        Mathematics: mathCount,
        Portuguese: porCount,
      };
    });
  }, [allRecords, mathRecords, porRecords]);

  return (
    <div className="space-y-12">
      {/* Page Title & Intro */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#74766F]">
          DETAILED ACADEMIC EVALUATION
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#26342E] mt-1">
          Performance <span className="text-[#D95D24]">Analysis</span>
        </h1>
        <p className="text-sm text-[#74766F] max-w-3xl leading-relaxed mt-2">
          An empirical comparison of Mathematics (n=395) and Portuguese (n=649) student marks across the three trimesters, grading bands, and score variance.
        </p>
      </div>

      {/* 1. Descriptive Grade Summary Table */}
      <div className="space-y-3">
        <h2 className="font-heading text-xl font-bold text-[#26342E]">
          Cohort Statistics Summary
        </h2>

        <div className="bg-white border border-[#E8E4DB] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DB] bg-[#FAF7F0] text-[#26342E]">
                <th className="py-3 px-4 font-semibold">Cohort</th>
                <th className="py-3 px-4 font-semibold text-center">Records (n)</th>
                <th className="py-3 px-4 font-semibold text-center">Mean Grade</th>
                <th className="py-3 px-4 font-semibold text-center">Median</th>
                <th className="py-3 px-4 font-semibold text-center">Std Dev (σ)</th>
                <th className="py-3 px-4 font-semibold text-center">Range (Min–Max)</th>
                <th className="py-3 px-4 font-semibold text-center">Pass Rate (≥ 10)</th>
                <th className="py-3 px-4 font-semibold text-center">Zero-Grade Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DB] text-[#26342E]">
              <tr>
                <td className="py-3 px-4 font-medium text-[#D95D24]">Mathematics</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-bold">{mathStats.mean}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.median}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.std}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.min} – {mathStats.max}</td>
                <td className="py-3 px-4 text-center font-data">{mathStats.passRate}%</td>
                <td className="py-3 px-4 text-center font-data text-[#D95D24]">{mathStats.zeroRate}% (38)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#173B32]">Portuguese Language</td>
                <td className="py-3 px-4 text-center font-data">{porStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-bold">{porStats.mean}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.median}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.std}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.min} – {porStats.max}</td>
                <td className="py-3 px-4 text-center font-data">{porStats.passRate}%</td>
                <td className="py-3 px-4 text-center font-data text-[#173B32]">{porStats.zeroRate}% (15)</td>
              </tr>
              <tr className="bg-[#FAF7F0]/60 font-medium">
                <td className="py-3 px-4 text-[#26342E]">Combined Overall</td>
                <td className="py-3 px-4 text-center font-data">{combinedStats.count}</td>
                <td className="py-3 px-4 text-center font-data font-bold">{combinedStats.mean}</td>
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

      {/* 2. Frequency Histogram Chart */}
      <div className="space-y-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#26342E]">
            Final Grade Distribution (Integer Scores 0 to 20)
          </h2>
          <p className="text-xs text-[#74766F]">
            Direct breakdown of students achieving each score in Mathematics (burnt orange) and Portuguese (forest green).
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                          <p className="font-semibold text-[#26342E] mb-1">Score: {data.binLabel} / 20</p>
                          <p className="text-[#D95D24]">Mathematics: {data.mathCount} students</p>
                          <p className="text-[#173B32]">Portuguese: {data.porCount} students</p>
                          <p className="text-[#74766F] mt-1 pt-1 border-t border-[#E8E4DB]">Total: {data.count} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="mathCount" name="Mathematics" fill="#D95D24" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="porCount" name="Portuguese" fill="#173B32" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[#74766F] mt-3">
            Note the prominent spike at mark 0 (38 in Math, 15 in Portuguese). When excluding zero-marks, both subjects exhibit standard bell curves centered around grades 11–13.
          </p>
        </div>
      </div>

      {/* 3. Trimester Progression & Statutory Grade Bands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trimester Progression */}
        <div className="space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#26342E]">
              Trimester Assessment Progression
            </h2>
            <p className="text-xs text-[#74766F]">
              Average mark progression across Period 1 (G1), Period 2 (G2), and Final Evaluation (G3).
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis dataKey="period" stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                  <YAxis domain={[8, 14]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E4DB', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="Portuguese" 
                    stroke="#173B32" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#173B32' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Mathematics" 
                    stroke="#D95D24" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#D95D24' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#74766F] mt-3">
              Grade trajectories remain remarkably steady across trimesters. G1 and G2 establish a student's performance band with strong longitudinal continuity.
            </p>
          </div>
        </div>

        {/* Statutory Grade Bands */}
        <div className="space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#26342E]">
              National Achievement Bands
            </h2>
            <p className="text-xs text-[#74766F]">
              Official secondary education classification according to Portuguese statutory thresholds.
            </p>
          </div>

          <div className="space-y-2.5">
            {statutoryBands.map((band, idx) => (
              <div key={idx} className="p-3 bg-white border border-[#E8E4DB] rounded-lg">
                <div className="flex justify-between items-center text-xs mb-1">
                  <div>
                    <span className="font-semibold text-[#26342E]">{band.band}</span>
                    <span className="text-[#74766F] ml-2 text-[11px]">({band.description})</span>
                  </div>
                  <span className="font-data font-bold text-[#26342E]">
                    {band.total} students ({band.percentage}%)
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#74766F]">
                  <span>Mathematics: {band.Mathematics}</span>
                  <span>Portuguese: {band.Portuguese}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
