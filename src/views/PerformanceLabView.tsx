import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { calculateHistogram, calculateBoxPlotStats, calculateDescriptive } from '../utils/statistics';
import { Sliders, AlertTriangle, Layers, Info, CheckCircle2 } from 'lucide-react';

export const PerformanceLabView: React.FC = () => {
  const { filteredRecords, filters } = useData();
  const [selectedGradeKey, setSelectedGradeKey] = useState<'G1' | 'G2' | 'G3'>('G3');
  const [activeViewMode, setActiveViewMode] = useState<'histogram' | 'boxplot' | 'zeroAnalysis'>('histogram');

  // Exact Histogram bins 0 to 20
  const histogramData = useMemo(() => {
    return calculateHistogram(filteredRecords, selectedGradeKey, 0, 20);
  }, [filteredRecords, selectedGradeKey]);

  // Box plot statistical values for Math and Portuguese
  const boxPlotMath = useMemo(() => {
    const mathVals = filteredRecords.filter(r => r.subject === 'Mathematics').map(r => r[selectedGradeKey]);
    return {
      stats: calculateBoxPlotStats(mathVals),
      desc: calculateDescriptive(mathVals)
    };
  }, [filteredRecords, selectedGradeKey]);

  const boxPlotPor = useMemo(() => {
    const porVals = filteredRecords.filter(r => r.subject === 'Portuguese').map(r => r[selectedGradeKey]);
    return {
      stats: calculateBoxPlotStats(porVals),
      desc: calculateDescriptive(porVals)
    };
  }, [filteredRecords, selectedGradeKey]);

  // Zero-grade anomaly inspection (students with G3 == 0)
  const zeroGradeStudents = useMemo(() => {
    return filteredRecords.filter(r => r.G3 === 0);
  }, [filteredRecords]);

  return (
    <div className="space-y-8">
      <EditorialHeader
        kicker="Academic Performance Lab"
        title="Grade Distribution & Outlier Laboratory"
        description="Empirical inspection of student mark clustering, quartile spread, Tukey fences, and examination anomalies across assessment periods."
        tags={[
          { label: `Evaluated: ${selectedGradeKey}`, color: 'terracotta' },
          { label: `Active Records: ${filteredRecords.length}`, color: 'green' }
        ]}
      >
        {/* Assessment Period Toggle */}
        <div className="flex bg-[#EAE6D8] p-1 rounded-xl border border-[#DCD6C5] text-xs font-semibold">
          {(['G1', 'G2', 'G3'] as const).map(key => (
            <button
              key={key}
              onClick={() => setSelectedGradeKey(key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGradeKey === key
                  ? 'bg-[#17382B] text-white shadow-xs'
                  : 'text-[#5A6861] hover:text-[#17382B]'
              }`}
            >
              {key === 'G1' ? 'First Period (G1)' : key === 'G2' ? 'Second Period (G2)' : 'Final Grade (G3)'}
            </button>
          ))}
        </div>
      </EditorialHeader>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-[#E0DBCB] space-x-6 text-sm">
        <button
          onClick={() => setActiveViewMode('histogram')}
          className={`pb-3 font-semibold transition-all relative ${
            activeViewMode === 'histogram'
              ? 'text-[#17382B] border-b-2 border-[#17382B]'
              : 'text-[#68736B] hover:text-[#17382B]'
          }`}
        >
          Integer Frequency Histogram
        </button>
        <button
          onClick={() => setActiveViewMode('boxplot')}
          className={`pb-3 font-semibold transition-all relative ${
            activeViewMode === 'boxplot'
              ? 'text-[#17382B] border-b-2 border-[#17382B]'
              : 'text-[#68736B] hover:text-[#17382B]'
          }`}
        >
          Box-and-Whisker & Quartiles
        </button>
        <button
          onClick={() => setActiveViewMode('zeroAnalysis')}
          className={`pb-3 font-semibold transition-all relative flex items-center space-x-1.5 ${
            activeViewMode === 'zeroAnalysis'
              ? 'text-[#C55A38] border-b-2 border-[#C55A38]'
              : 'text-[#68736B] hover:text-[#C55A38]'
          }`}
        >
          <span>Zero-Grade Anomaly Inspector</span>
          <span className="w-5 h-5 rounded-full bg-[#C55A38]/15 text-[#C55A38] text-[10px] flex items-center justify-center font-bold">
            {zeroGradeStudents.length}
          </span>
        </button>
      </div>

      {/* Mode 1: Frequency Histogram */}
      {activeViewMode === 'histogram' && (
        <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
                Frequency Spectrum
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                Distribution of {selectedGradeKey} Marks (0 to 20 Scale)
              </h3>
            </div>
            <div className="text-xs text-[#68736B] font-mono-data">
              Total records evaluated: {filteredRecords.length}
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DA" />
                <XAxis 
                  dataKey="binLabel" 
                  stroke="#68736B" 
                  label={{ value: `Grade on 0–20 Scale (${selectedGradeKey})`, position: 'insideBottom', offset: -10, fontSize: 12, fill: '#17382B' }} 
                />
                <YAxis 
                  stroke="#68736B" 
                  label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#17382B' }} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFDF9] border border-[#D4CEBF] p-3 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-[#17382B] mb-1">
                            Grade Score: {data.binLabel} / 20
                          </p>
                          <p className="text-[#C55A38]">
                            Mathematics: <strong>{data.mathCount}</strong> students
                          </p>
                          <p className="text-[#17382B]">
                            Portuguese: <strong>{data.porCount}</strong> students
                          </p>
                          <p className="text-[#68736B] mt-1 pt-1 border-t border-[#EAE4D5]">
                            Total in bin: <strong>{data.count}</strong> ({data.density}% of cohort)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {(filters.subject === 'all' || filters.subject === 'Mathematics') && (
                  <Bar dataKey="mathCount" name="Mathematics Cohort" fill="#C55A38" stackId="a" radius={[0, 0, 0, 0]} />
                )}
                {(filters.subject === 'all' || filters.subject === 'Portuguese') && (
                  <Bar dataKey="porCount" name="Portuguese Language" fill="#17382B" stackId="a" radius={[3, 3, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#F8F5EC] p-4 rounded-xl border border-[#E4DEC9] text-xs text-[#5A6861] flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-[#C55A38] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#17382B]">Analytical Observation:</strong> Notice the distinct spike at grade 0 in {selectedGradeKey}. In academic observational datasets, zero marks predominantly represent exam absence, non-submission, or course withdrawal rather than an assessed capability of zero. Normal distributions typically resume between grades 6 and 18.
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Box-and-Whisker Quartiles */}
      {activeViewMode === 'boxplot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mathematics Quartile Breakdown */}
          <div className="bg-paper-card rounded-2xl p-6 border border-[#E9C8BC] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
                Mathematics ({selectedGradeKey})
              </span>
              <span className="font-mono-data text-xs bg-[#C55A38]/10 text-[#C55A38] px-2 py-0.5 rounded font-bold">
                n = {boxPlotMath.desc.count}
              </span>
            </div>

            {/* Quartile Table */}
            <div className="space-y-2.5 text-xs mb-6">
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Minimum Observed</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotMath.stats.min}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">First Quartile (Q1 / 25th percentile)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotMath.stats.q1}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#C55A38]/10 rounded-lg border border-[#C55A38]/20">
                <span className="font-bold text-[#C55A38]">Median (50th percentile)</span>
                <span className="font-mono-data font-bold text-[#C55A38] text-sm">{boxPlotMath.stats.median}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Third Quartile (Q3 / 75th percentile)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotMath.stats.q3}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Maximum Observed</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotMath.stats.max}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Interquartile Range (IQR = Q3 - Q1)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotMath.desc.iqr}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FCF8F6] rounded-xl border border-[#F0DCD3] text-xs text-[#7A8880]">
              <strong>Tukey Fences:</strong> Lower: {boxPlotMath.stats.lowerFence} · Upper: {boxPlotMath.stats.upperFence}
              <br />
              <strong>Identified Outliers:</strong> {boxPlotMath.stats.outliers.length > 0 ? boxPlotMath.stats.outliers.join(', ') : 'None outside fences'}
            </div>
          </div>

          {/* Portuguese Quartile Breakdown */}
          <div className="bg-paper-card rounded-2xl p-6 border border-[#C8DAC6] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
                Portuguese Language ({selectedGradeKey})
              </span>
              <span className="font-mono-data text-xs bg-[#17382B]/10 text-[#17382B] px-2 py-0.5 rounded font-bold">
                n = {boxPlotPor.desc.count}
              </span>
            </div>

            {/* Quartile Table */}
            <div className="space-y-2.5 text-xs mb-6">
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Minimum Observed</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotPor.stats.min}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">First Quartile (Q1 / 25th percentile)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotPor.stats.q1}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#17382B]/10 rounded-lg border border-[#17382B]/20">
                <span className="font-bold text-[#17382B]">Median (50th percentile)</span>
                <span className="font-mono-data font-bold text-[#17382B] text-sm">{boxPlotPor.stats.median}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Third Quartile (Q3 / 75th percentile)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotPor.stats.q3}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Maximum Observed</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotPor.stats.max}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF7EE] rounded-lg">
                <span className="text-[#68736B]">Interquartile Range (IQR = Q3 - Q1)</span>
                <span className="font-mono-data font-bold text-[#17382B]">{boxPlotPor.desc.iqr}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F4F8F4] rounded-xl border border-[#D5E3D3] text-xs text-[#7A8880]">
              <strong>Tukey Fences:</strong> Lower: {boxPlotPor.stats.lowerFence} · Upper: {boxPlotPor.stats.upperFence}
              <br />
              <strong>Identified Outliers:</strong> {boxPlotPor.stats.outliers.length > 0 ? boxPlotPor.stats.outliers.join(', ') : 'None outside fences'}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Zero-Grade Anomaly Inspector */}
      {activeViewMode === 'zeroAnalysis' && (
        <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs space-y-6">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-[#C55A38] font-bold text-xs uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Rigorous Data Audit</span>
            </div>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-2">
              The G3 = 0 Phenomenon: Dropout or Deficit?
            </h3>
            <p className="text-xs sm:text-sm text-[#68736B] leading-relaxed">
              In the raw dataset, exactly <strong>38 Mathematics students (9.6%)</strong> and <strong>15 Portuguese students (2.3%)</strong> received a final grade of 0. Scientifically, treating a grade of 0 as genuine academic mastery failure without investigation creates distorted correlation metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
              <span className="text-xs font-bold text-[#17382B] block mb-1">
                Zero Grades in Math
              </span>
              <span className="font-serif-editorial text-3xl font-bold text-[#C55A38]">
                {zeroGradeStudents.filter(r => r.subject === 'Mathematics').length}
              </span>
              <p className="text-[11px] text-[#68736B] mt-1">
                Accounts for 71.7% of all zero-grade occurrences across the dataset.
              </p>
            </div>

            <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
              <span className="text-xs font-bold text-[#17382B] block mb-1">
                Zero Grades in Portuguese
              </span>
              <span className="font-serif-editorial text-3xl font-bold text-[#17382B]">
                {zeroGradeStudents.filter(r => r.subject === 'Portuguese').length}
              </span>
              <p className="text-[11px] text-[#68736B] mt-1">
                Significantly lower incidence (2.3%), showing higher course retention.
              </p>
            </div>

            <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
              <span className="text-xs font-bold text-[#17382B] block mb-1">
                Average G1 Mark for Zero-Graders
              </span>
              <span className="font-serif-editorial text-3xl font-bold text-[#D9A441]">
                {zeroGradeStudents.length 
                  ? (zeroGradeStudents.reduce((a, b) => a + b.G1, 0) / zeroGradeStudents.length).toFixed(1)
                  : '0'}
              </span>
              <p className="text-[11px] text-[#68736B] mt-1">
                Students who got G3=0 originally started with positive marks in G1 and G2.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7EE] p-5 rounded-xl border border-[#E2DBD0] text-xs text-[#5A6861] space-y-2">
            <h4 className="font-serif-editorial text-sm font-bold text-[#17382B]">
              Scientific Recommendation for Viva Defense:
            </h4>
            <p>
              • <strong>Do not mislabel zero grades as confirmed dropouts</strong>: The original authors (Cortez & Silva, 2008) noted that zero grades represent students who missed the final exam session or withdrew from the trimester evaluation.
            </p>
            <p>
              • In this platform, all records are preserved in full transparency without silently pruning zero-graders or biasing the sample.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
