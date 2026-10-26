import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  calculateDescriptive, 
  calculatePearsonCorrelation, 
  calculateLinearRegression, 
  interpretCorrelation 
} from '../utils/statistics';
import { StudentRecord, SubjectFilter } from '../types/student';
import { 
  Filter, 
  RotateCcw, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Users, 
  Info, 
  SlidersHorizontal, 
  Sparkles, 
  Eye, 
  X, 
  ChevronRight, 
  Check 
} from 'lucide-react';

const ALL_NUMERIC_VARS: { key: keyof StudentRecord; label: string; desc: string }[] = [
  { key: 'G3', label: 'Final Grade (G3)', desc: 'Final course examination mark (0–20)' },
  { key: 'G1', label: 'Period 1 (G1)', desc: 'First trimester period evaluation (0–20)' },
  { key: 'G2', label: 'Period 2 (G2)', desc: 'Second trimester period evaluation (0–20)' },
  { key: 'studytime', label: 'Study Time', desc: 'Weekly study hours: 1 (<2h) to 4 (>10h)' },
  { key: 'failures', label: 'Past Failures', desc: 'Number of past class failures (0 to 3+)' },
  { key: 'absences', label: 'Absences', desc: 'Cumulative days absent from classes' },
  { key: 'Medu', label: "Mother's Edu", desc: "Mother's education: 0 (None) to 4 (Higher)" },
  { key: 'Fedu', label: "Father's Edu", desc: "Father's education: 0 (None) to 4 (Higher)" },
  { key: 'traveltime', label: 'Travel Time', desc: 'Commute duration: 1 (<15m) to 4 (>1h)' },
  { key: 'freetime', label: 'Free Time', desc: 'After-school free leisure scale (1 to 5)' },
  { key: 'goout', label: 'Going Out', desc: 'Socializing frequency with peers (1 to 5)' },
  { key: 'Dalc', label: 'Workday Alcohol', desc: 'Weekday alcohol consumption scale (1 to 5)' },
  { key: 'Walc', label: 'Weekend Alcohol', desc: 'Weekend alcohol intake scale (1 to 5)' },
  { key: 'health', label: 'Health Status', desc: 'Self-reported current health (1 to 5)' },
];

export const FactorsView: React.FC = () => {
  const { allRecords, setSelectedStudentRecord } = useData();

  // --- Shared Filter State ---
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [minGrade, setMinGrade] = useState<number>(0);
  const [maxGrade, setMaxGrade] = useState<number>(20);
  const [studyTimeFilter, setStudyTimeFilter] = useState<string>('all');
  const [maxAbsences, setMaxAbsences] = useState<number>(93);
  const [failuresFilter, setFailuresFilter] = useState<string>('all');

  // --- Interactive State for Chart Clicks ---
  // A. Heatmap Cell Selection
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ x: keyof StudentRecord; y: keyof StudentRecord } | null>({
    x: 'studytime',
    y: 'G3'
  });
  // Active features for heatmap matrix
  const [activeFeatures, setActiveFeatures] = useState<string[]>([
    'G3', 'G1', 'G2', 'studytime', 'failures', 'absences', 'Medu', 'Fedu', 'goout', 'health'
  ]);

  // B. Study Time Color Mode & Point Inspection
  const [studyColorMode, setStudyColorMode] = useState<'subject' | 'sex'>('subject');
  const [inspectedStudent, setInspectedStudent] = useState<StudentRecord | null>(null);

  // C. Absence Tier Selection
  const [selectedAbsenceTier, setSelectedAbsenceTier] = useState<string | null>(null);

  // D. Selected Failure Group
  const [selectedFailureGroup, setSelectedFailureGroup] = useState<number | null>(null);

  // E. Other Factors Category
  const [otherFactorTab, setOtherFactorTab] = useState<'support' | 'parentEdu' | 'internet' | 'higher' | 'travel'>('support');

  // F. Custom Factor Comparison State
  const [compareVarX, setCompareVarX] = useState<keyof StudentRecord>('studytime');
  const [compareVarY, setCompareVarY] = useState<keyof StudentRecord>('G3');
  const [compareGroupVar, setCompareGroupVar] = useState<'none' | 'subject' | 'sex' | 'school'>('subject');

  // --- Filtered Dataset Computation ---
  const filteredDataset = useMemo(() => {
    return allRecords.filter(r => {
      // Subject
      if (subjectFilter !== 'all' && r.subject !== subjectFilter) return false;
      // Grade Range
      if (r.G3 < minGrade || r.G3 > maxGrade) return false;
      // Study Time
      if (studyTimeFilter !== 'all' && r.studytime !== Number(studyTimeFilter)) return false;
      // Absences
      if (r.absences > maxAbsences) return false;
      // Failures
      if (failuresFilter !== 'all') {
        const fVal = Number(failuresFilter);
        if (fVal === 3 && r.failures < 3) return false;
        if (fVal < 3 && r.failures !== fVal) return false;
      }
      // Cross-filter: Clicked Failure Group
      if (selectedFailureGroup !== null) {
        if (selectedFailureGroup === 3 && r.failures < 3) return false;
        if (selectedFailureGroup < 3 && r.failures !== selectedFailureGroup) return false;
      }
      // Cross-filter: Clicked Absence Tier
      if (selectedAbsenceTier !== null) {
        if (selectedAbsenceTier === '0-5' && (r.absences < 0 || r.absences > 5)) return false;
        if (selectedAbsenceTier === '6-10' && (r.absences < 6 || r.absences > 10)) return false;
        if (selectedAbsenceTier === '11-20' && (r.absences < 11 || r.absences > 20)) return false;
        if (selectedAbsenceTier === '21+' && r.absences < 21) return false;
      }

      return true;
    });
  }, [allRecords, subjectFilter, minGrade, maxGrade, studyTimeFilter, maxAbsences, failuresFilter, selectedFailureGroup, selectedAbsenceTier]);

  // Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (subjectFilter !== 'all') count++;
    if (minGrade > 0 || maxGrade < 20) count++;
    if (studyTimeFilter !== 'all') count++;
    if (maxAbsences < 93) count++;
    if (failuresFilter !== 'all') count++;
    if (selectedFailureGroup !== null) count++;
    if (selectedAbsenceTier !== null) count++;
    return count;
  }, [subjectFilter, minGrade, maxGrade, studyTimeFilter, maxAbsences, failuresFilter, selectedFailureGroup, selectedAbsenceTier]);

  const handleResetAllFilters = () => {
    setSubjectFilter('all');
    setMinGrade(0);
    setMaxGrade(20);
    setStudyTimeFilter('all');
    setMaxAbsences(93);
    setFailuresFilter('all');
    setSelectedFailureGroup(null);
    setSelectedAbsenceTier(null);
    setInspectedStudent(null);
  };

  // --- Summary Statistics above charts ---
  const summaryStats = useMemo(() => {
    const desc = calculateDescriptive(filteredDataset.map(r => r.G3));
    const avgAbs = filteredDataset.length 
      ? (filteredDataset.reduce((acc, r) => acc + r.absences, 0) / filteredDataset.length).toFixed(2) 
      : '0';
    const avgFail = filteredDataset.length 
      ? (filteredDataset.reduce((acc, r) => acc + r.failures, 0) / filteredDataset.length).toFixed(2) 
      : '0';

    return {
      count: desc.count,
      meanGrade: desc.mean,
      medianGrade: desc.median,
      avgAbsences: avgAbs,
      avgFailures: avgFail,
      passRate: desc.passRate,
    };
  }, [filteredDataset]);

  // --- Section A: Heatmap Matrix Calculation ---
  const activeFeaturesList = useMemo(() => {
    return ALL_NUMERIC_VARS.filter(v => activeFeatures.includes(v.key as string));
  }, [activeFeatures]);

  const heatmapMatrix = useMemo(() => {
    const keys = activeFeaturesList.map(v => v.key);
    const matrix: Record<string, Record<string, number>> = {};

    keys.forEach(k1 => {
      matrix[k1 as string] = {};
      const xVals = filteredDataset.map(r => Number(r[k1]));

      keys.forEach(k2 => {
        const yVals = filteredDataset.map(r => Number(r[k2]));
        matrix[k1 as string][k2 as string] = calculatePearsonCorrelation(xVals, yVals);
      });
    });

    return matrix;
  }, [activeFeaturesList, filteredDataset]);

  // Selected cell analysis & interpretation
  const cellAnalysis = useMemo(() => {
    if (!selectedHeatmapCell) return null;
    const xKey = selectedHeatmapCell.x;
    const yKey = selectedHeatmapCell.y;
    const xVals = filteredDataset.map(r => Number(r[xKey]));
    const yVals = filteredDataset.map(r => Number(r[yKey]));

    const r = calculatePearsonCorrelation(xVals, yVals);
    const reg = calculateLinearRegression(xVals, yVals);
    const varXMeta = ALL_NUMERIC_VARS.find(v => v.key === xKey);
    const varYMeta = ALL_NUMERIC_VARS.find(v => v.key === yKey);
    const interp = interpretCorrelation(r, varXMeta?.label || String(xKey), varYMeta?.label || String(yKey));

    return {
      xKey,
      yKey,
      xLabel: varXMeta?.label || String(xKey),
      yLabel: varYMeta?.label || String(yKey),
      r,
      reg,
      interp,
      n: filteredDataset.length,
      scatterData: filteredDataset.map((rec, idx) => ({
        x: Number(rec[xKey]),
        y: Number(rec[yKey]),
        id: rec.id,
        subject: rec.subject,
        jitterY: Number(rec[yKey]) + (Math.sin(idx) * 0.15) // subtle deterministic jitter for clean visual separation
      }))
    };
  }, [selectedHeatmapCell, filteredDataset]);

  const getHeatmapCellColor = (r: number) => {
    if (r === 1) return 'bg-[#203B2F] text-white font-bold';
    if (r > 0.5) return 'bg-[#203B2F]/85 text-white font-semibold';
    if (r > 0.15) return 'bg-[#DCE5D8] text-[#203B2F] font-medium';
    if (r > -0.15) return 'bg-[#FAF7F0] text-[#74766F]';
    if (r > -0.3) return 'bg-[#F3D6C2] text-[#D65A24] font-medium';
    return 'bg-[#D65A24] text-white font-semibold';
  };

  // --- Section B: Study Time vs Grade Points ---
  const studyScatterData = useMemo(() => {
    return filteredDataset.map((r, idx) => ({
      studytime: r.studytime,
      // deterministic jitter on studytime integer (1, 2, 3, 4) to view individual density without altering true value
      displayX: r.studytime + (Math.sin(idx * 7) * 0.18),
      grade: r.G3,
      id: r.id,
      subject: r.subject,
      sex: r.sex,
      absences: r.absences,
      failures: r.failures,
      fullRecord: r
    }));
  }, [filteredDataset]);

  const studyRegression = useMemo(() => {
    const x = filteredDataset.map(r => r.studytime);
    const y = filteredDataset.map(r => r.G3);
    return calculateLinearRegression(x, y);
  }, [filteredDataset]);

  // --- Section C: Absences Analysis by Tiers ---
  const absenceTiersData = useMemo(() => {
    const tiers = [
      { key: '0-5', label: '0–5 days', min: 0, max: 5 },
      { key: '6-10', label: '6–10 days', min: 6, max: 10 },
      { key: '11-20', label: '11–20 days', min: 11, max: 20 },
      { key: '21+', label: '21+ days', min: 21, max: 93 },
    ];

    return tiers.map(t => {
      const recs = filteredDataset.filter(r => r.absences >= t.min && r.absences <= t.max);
      const desc = calculateDescriptive(recs.map(r => r.G3));
      return {
        key: t.key,
        label: t.label,
        count: recs.length,
        averageGrade: desc.mean,
        median: desc.median,
        passRate: desc.passRate,
        isSelected: selectedAbsenceTier === t.key
      };
    });
  }, [filteredDataset, selectedAbsenceTier]);

  // --- Section D: Previous Failures vs Final Grade ---
  const failuresData = useMemo(() => {
    return [0, 1, 2, 3].map(f => {
      const recs = f === 3 
        ? filteredDataset.filter(r => r.failures >= 3) 
        : filteredDataset.filter(r => r.failures === f);
      const desc = calculateDescriptive(recs.map(r => r.G3));
      const label = f === 3 ? '3+ Failures' : `${f} Failure${f === 1 ? '' : 's'}`;

      return {
        failureCount: f,
        label,
        count: recs.length,
        mean: desc.mean,
        median: desc.median,
        passRate: desc.passRate,
        isSelected: selectedFailureGroup === f
      };
    });
  }, [filteredDataset, selectedFailureGroup]);

  // --- Section E: Other Factors Comparison Data ---
  const otherFactorData = useMemo(() => {
    if (otherFactorTab === 'support') {
      const withSchoolSup = filteredDataset.filter(r => r.schoolsup === 'yes');
      const withoutSchoolSup = filteredDataset.filter(r => r.schoolsup === 'no');
      const withFamSup = filteredDataset.filter(r => r.famsup === 'yes');
      const withoutFamSup = filteredDataset.filter(r => r.famsup === 'no');

      return [
        { group: 'No School Support', mean: calculateDescriptive(withoutSchoolSup.map(r => r.G3)).mean, count: withoutSchoolSup.length },
        { group: 'With School Support', mean: calculateDescriptive(withSchoolSup.map(r => r.G3)).mean, count: withSchoolSup.length },
        { group: 'No Family Support', mean: calculateDescriptive(withoutFamSup.map(r => r.G3)).mean, count: withoutFamSup.length },
        { group: 'With Family Support', mean: calculateDescriptive(withFamSup.map(r => r.G3)).mean, count: withFamSup.length },
      ];
    } else if (otherFactorTab === 'parentEdu') {
      return [0, 1, 2, 3, 4].map(level => {
        const eduNames = ['None', 'Primary', '5th–9th', 'Secondary', 'Higher'];
        const mRecs = filteredDataset.filter(r => r.Medu === level);
        const fRecs = filteredDataset.filter(r => r.Fedu === level);
        return {
          group: eduNames[level],
          mean: 0,
          Mother: mRecs.length ? calculateDescriptive(mRecs.map(r => r.G3)).mean : 0,
          Father: fRecs.length ? calculateDescriptive(fRecs.map(r => r.G3)).mean : 0,
          count: mRecs.length + fRecs.length
        };
      });
    } else if (otherFactorTab === 'internet') {
      const withNet = filteredDataset.filter(r => r.internet === 'yes');
      const withoutNet = filteredDataset.filter(r => r.internet === 'no');
      return [
        { group: 'Internet at Home', mean: calculateDescriptive(withNet.map(r => r.G3)).mean, count: withNet.length },
        { group: 'No Internet at Home', mean: calculateDescriptive(withoutNet.map(r => r.G3)).mean, count: withoutNet.length },
      ];
    } else if (otherFactorTab === 'higher') {
      const yesHigher = filteredDataset.filter(r => r.higher === 'yes');
      const noHigher = filteredDataset.filter(r => r.higher === 'no');
      return [
        { group: 'Aspires Higher Education', mean: calculateDescriptive(yesHigher.map(r => r.G3)).mean, count: yesHigher.length },
        { group: 'No Higher Ed Plan', mean: calculateDescriptive(noHigher.map(r => r.G3)).mean, count: noHigher.length },
      ];
    } else {
      // travel time
      const travelLabels = ['< 15 min', '15–30 min', '30 min–1h', '> 1 hour'];
      return [1, 2, 3, 4].map(t => {
        const recs = filteredDataset.filter(r => r.traveltime === t);
        return {
          group: travelLabels[t - 1],
          mean: recs.length ? calculateDescriptive(recs.map(r => r.G3)).mean : 0,
          count: recs.length
        };
      });
    }
  }, [otherFactorTab, filteredDataset]);

  // --- Section F: Custom Variable Comparison Plot ---
  const customComparePlot = useMemo(() => {
    const xKey = compareVarX;
    const yKey = compareVarY;
    const xVals = filteredDataset.map(r => Number(r[xKey]));
    const yVals = filteredDataset.map(r => Number(r[yKey]));

    const reg = calculateLinearRegression(xVals, yVals);
    const corr = calculatePearsonCorrelation(xVals, yVals);

    const xMeta = ALL_NUMERIC_VARS.find(v => v.key === xKey);
    const yMeta = ALL_NUMERIC_VARS.find(v => v.key === yKey);

    return {
      xLabel: xMeta?.label || String(xKey),
      yLabel: yMeta?.label || String(yKey),
      reg,
      corr,
      data: filteredDataset.map((rec, i) => ({
        x: Number(rec[xKey]) + (Math.sin(i * 3) * 0.12), // gentle jitter
        y: Number(rec[yKey]),
        id: rec.id,
        group: compareGroupVar === 'subject' ? rec.subject : compareGroupVar === 'sex' ? rec.sex : compareGroupVar === 'school' ? rec.school : 'All',
        fullRecord: rec
      }))
    };
  }, [compareVarX, compareVarY, compareGroupVar, filteredDataset]);

  return (
    <div className="space-y-12">
      {/* 1. Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#74766F]">
          INTERACTIVE EXPLORATION WORKSPACE
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#292F2A] mt-1">
          Factor & <span className="text-[#D65A24]">Relationship Analysis</span>
        </h1>
        <p className="text-sm text-[#74766F] max-w-3xl leading-relaxed mt-2">
          An interactive laboratory exploring how study commitment, absences, academic history, support systems, and demographic factors correlate with secondary academic achievement. Filter, cross-select, and inspect records dynamically below.
        </p>
      </div>

      {/* 2. Compact Shared Filter Area at Top */}
      <div className="bg-white border border-[#E7E1D6] rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E1D6]">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#292F2A]">
            <SlidersHorizontal className="w-4 h-4 text-[#D65A24]" />
            <span>Interactive Workspace Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D65A24] text-white text-[11px] font-medium">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-[#74766F]">
              Showing <strong className="text-[#203B2F] font-data">{filteredDataset.length}</strong> of {allRecords.length} records
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetAllFilters}
                className="flex items-center space-x-1 text-xs text-[#D65A24] hover:underline font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* 1. Subject */}
          <div>
            <label className="block text-[#74766F] font-medium mb-1">Subject Cohort</label>
            <div className="flex rounded border border-[#E7E1D6] bg-[#FAF7F0] p-0.5">
              {(['all', 'Mathematics', 'Portuguese'] as const).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`flex-1 py-1 px-1.5 text-center rounded text-[11px] font-medium transition-colors ${
                    subjectFilter === sub 
                      ? sub === 'Mathematics' ? 'bg-[#D65A24] text-white' : 'bg-[#203B2F] text-white' 
                      : 'text-[#74766F] hover:text-[#292F2A]'
                  }`}
                >
                  {sub === 'all' ? 'All (1,044)' : sub === 'Mathematics' ? 'Math (395)' : 'Por (649)'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Final Grade Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#74766F] font-medium">Grade Range (G3)</label>
              <span className="font-data text-[#D65A24] font-semibold">{minGrade}–{maxGrade}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="20"
                value={minGrade}
                onChange={e => setMinGrade(Math.min(Number(e.target.value), maxGrade))}
                className="w-full accent-[#203B2F]"
              />
              <input
                type="range"
                min="0"
                max="20"
                value={maxGrade}
                onChange={e => setMaxGrade(Math.max(Number(e.target.value), minGrade))}
                className="w-full accent-[#203B2F]"
              />
            </div>
          </div>

          {/* 3. Study Time */}
          <div>
            <label className="block text-[#74766F] font-medium mb-1">Weekly Study Time</label>
            <select
              value={studyTimeFilter}
              onChange={e => setStudyTimeFilter(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-[#E7E1D6] rounded px-2.5 py-1.5 text-[#292F2A] font-medium"
            >
              <option value="all">All Study Categories</option>
              <option value="1">Category 1 (&lt; 2 hrs/week)</option>
              <option value="2">Category 2 (2 to 5 hrs/week)</option>
              <option value="3">Category 3 (5 to 10 hrs/week)</option>
              <option value="4">Category 4 (&gt; 10 hrs/week)</option>
            </select>
          </div>

          {/* 4. Maximum Absences */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#74766F] font-medium">Max Absences</label>
              <span className="font-data text-[#292F2A] font-semibold">≤ {maxAbsences} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="93"
              value={maxAbsences}
              onChange={e => setMaxAbsences(Number(e.target.value))}
              className="w-full accent-[#D65A24] mt-1"
            />
          </div>

          {/* 5. Past Failures */}
          <div>
            <label className="block text-[#74766F] font-medium mb-1">Past Class Failures</label>
            <select
              value={failuresFilter}
              onChange={e => setFailuresFilter(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-[#E7E1D6] rounded px-2.5 py-1.5 text-[#292F2A] font-medium"
            >
              <option value="all">All Failure Levels</option>
              <option value="0">0 Failures (Clean track)</option>
              <option value="1">1 Failure</option>
              <option value="2">2 Failures</option>
              <option value="3">3+ Failures</option>
            </select>
          </div>
        </div>

        {/* Active Cross-filter badges */}
        {(selectedFailureGroup !== null || selectedAbsenceTier !== null) && (
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#E7E1D6]/60 text-xs">
            <span className="text-[#74766F]">Active Chart Cross-filters:</span>
            {selectedFailureGroup !== null && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#F3D6C2] text-[#D65A24] font-medium">
                <span>Failures: {selectedFailureGroup === 3 ? '3+' : selectedFailureGroup}</span>
                <button onClick={() => setSelectedFailureGroup(null)} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedAbsenceTier !== null && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#DCE5D8] text-[#203B2F] font-medium">
                <span>Absences: {selectedAbsenceTier} days</span>
                <button onClick={() => setSelectedAbsenceTier(null)} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Horizontal Summary Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-4 px-5 bg-white border border-[#E7E1D6] rounded-lg">
        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Filtered Records</div>
          <div className="font-heading text-2xl font-bold text-[#292F2A] mt-0.5 font-data">
            {summaryStats.count}
          </div>
          <div className="text-[10px] text-[#74766F]">Active cohort</div>
        </div>

        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Average Grade (G3)</div>
          <div className="font-heading text-2xl font-bold text-[#D65A24] mt-0.5 font-data">
            {summaryStats.meanGrade}
          </div>
          <div className="text-[10px] text-[#74766F]">Scale 0–20</div>
        </div>

        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Median Grade</div>
          <div className="font-heading text-2xl font-bold text-[#203B2F] mt-0.5 font-data">
            {summaryStats.medianGrade}
          </div>
          <div className="text-[10px] text-[#74766F]">50th percentile</div>
        </div>

        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Average Absences</div>
          <div className="font-heading text-2xl font-bold text-[#292F2A] mt-0.5 font-data">
            {summaryStats.avgAbsences}
          </div>
          <div className="text-[10px] text-[#74766F]">Days absent</div>
        </div>

        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Average Failures</div>
          <div className="font-heading text-2xl font-bold text-[#292F2A] mt-0.5 font-data">
            {summaryStats.avgFailures}
          </div>
          <div className="text-[10px] text-[#74766F]">Prior failed courses</div>
        </div>

        <div>
          <div className="text-[11px] text-[#74766F] uppercase tracking-wider font-medium">Pass Rate (≥10)</div>
          <div className="font-heading text-2xl font-bold text-[#203B2F] mt-0.5 font-data">
            {summaryStats.passRate}%
          </div>
          <div className="text-[10px] text-[#74766F]">Statutory standard</div>
        </div>
      </div>

      {/* Empty State Warning */}
      {filteredDataset.length === 0 && (
        <div className="p-8 bg-white border border-[#E7E1D6] rounded-lg text-center space-y-3">
          <p className="font-heading text-xl font-bold text-[#292F2A]">No records match your active filters</p>
          <p className="text-xs text-[#74766F]">
            Try widening the grade range, resetting the study time, or adjusting the maximum absences filter.
          </p>
          <button
            onClick={handleResetAllFilters}
            className="px-4 py-2 bg-[#D65A24] text-white text-xs font-semibold rounded hover:bg-[#C24F1D] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {filteredDataset.length > 0 && (
        <>
          {/* 4. Section A: Interactive Correlation Heatmap with Click-To-Inspect */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#292F2A]">
                  A. Interactive Correlation Heatmap
                </h2>
                <p className="text-xs text-[#74766F]">
                  Click any cell in the matrix to view the exact bivariate correlation, statistical interpretation, and scatter plot.
                </p>
              </div>

              {/* Feature Checklist Dropdown / Pills */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#74766F]">Matrix Features ({activeFeatures.length}):</span>
                <button
                  onClick={() => setActiveFeatures(ALL_NUMERIC_VARS.map(v => v.key as string))}
                  className="text-[#D65A24] hover:underline font-medium"
                >
                  Select All
                </button>
                <span className="text-[#74766F]">·</span>
                <button
                  onClick={() => setActiveFeatures(['G3', 'G1', 'G2', 'studytime', 'failures', 'absences'])}
                  className="text-[#203B2F] hover:underline font-medium"
                >
                  Core Only
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Heatmap Grid (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#E7E1D6] rounded-lg p-4 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-left font-semibold text-[#292F2A] bg-[#FAF7F0] sticky left-0 border-b border-[#E7E1D6]">
                        Feature
                      </th>
                      {activeFeaturesList.map(v => (
                        <th
                          key={v.key as string}
                          className="p-2 text-center font-data font-medium text-[#74766F] border-b border-[#E7E1D6] whitespace-nowrap min-w-[55px]"
                        >
                          {v.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeFeaturesList.map(rowVar => (
                      <tr key={rowVar.key as string}>
                        <td className="p-2 text-left font-medium text-[#292F2A] bg-[#FAF7F0] sticky left-0 border-b border-[#E7E1D6] whitespace-nowrap">
                          {rowVar.label}
                        </td>
                        {activeFeaturesList.map(colVar => {
                          const val = heatmapMatrix[rowVar.key as string]?.[colVar.key as string] ?? 0;
                          const isSelected = selectedHeatmapCell?.x === colVar.key && selectedHeatmapCell?.y === rowVar.key;

                          return (
                            <td
                              key={colVar.key as string}
                              onClick={() => setSelectedHeatmapCell({ x: colVar.key, y: rowVar.key })}
                              title={`Click to inspect correlation between ${rowVar.label} and ${colVar.label}`}
                              className={`p-2 text-center font-data border-b border-r border-[#E7E1D6]/60 cursor-pointer transition-all ${getHeatmapCellColor(val)} ${
                                isSelected ? 'ring-2 ring-[#D65A24] font-bold z-10' : 'hover:opacity-85'
                              }`}
                            >
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex flex-wrap items-center justify-between text-xs text-[#74766F] mt-3 pt-3 border-t border-[#E7E1D6] gap-2">
                  <span>Click any cell to load bivariate inspection on the right.</span>
                  <div className="flex items-center space-x-2 font-mono-data text-[11px]">
                    <span className="inline-block w-2.5 h-2.5 bg-[#203B2F] rounded-xs" /> r &gt; 0.5
                    <span className="inline-block w-2.5 h-2.5 bg-[#DCE5D8] rounded-xs ml-1" /> Mild Positive
                    <span className="inline-block w-2.5 h-2.5 bg-[#D65A24] rounded-xs ml-1" /> Negative r &lt; -0.3
                  </div>
                </div>
              </div>

              {/* Right: Selected Cell Detail & Scatter Plot (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#E7E1D6] rounded-lg p-5 space-y-4">
                {cellAnalysis ? (
                  <>
                    <div>
                      <div className="text-[11px] text-[#74766F] uppercase font-bold tracking-wider">
                        Selected Bivariate Pair
                      </div>
                      <h3 className="font-heading text-lg font-bold text-[#292F2A] mt-0.5">
                        {cellAnalysis.xLabel} vs {cellAnalysis.yLabel}
                      </h3>
                      <div className="flex items-baseline space-x-3 mt-1">
                        <span className="font-heading text-2xl font-bold text-[#D65A24]">
                          r = {cellAnalysis.r.toFixed(3)}
                        </span>
                        <span className="text-xs text-[#74766F] font-data">
                          R² = {cellAnalysis.reg.r2} · n = {cellAnalysis.n}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#292F2A] leading-relaxed p-3 bg-[#FAF7F0] rounded border border-[#E7E1D6]">
                      {cellAnalysis.interp.text}
                    </p>

                    {/* Bivariate Scatter Plot for the clicked pair */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-[#74766F]">
                        <span>Linear Fit: <strong className="font-data text-[#203B2F]">{cellAnalysis.reg.equation}</strong></span>
                        <span>Sample: {cellAnalysis.n}</span>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 5, right: 10, bottom: 15, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                            <XAxis 
                              dataKey="x" 
                              stroke="#74766F" 
                              tick={{ fontSize: 10, fill: '#74766F' }}
                            />
                            <YAxis 
                              dataKey="jitterY" 
                              stroke="#74766F" 
                              domain={[0, 20]} 
                              tick={{ fontSize: 10, fill: '#74766F' }} 
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="bg-white border border-[#E7E1D6] p-2 rounded shadow-xs text-xs">
                                      <p className="font-bold text-[#292F2A]">{d.id} ({d.subject})</p>
                                      <p className="text-[#74766F]">{cellAnalysis.xLabel}: {d.x}</p>
                                      <p className="text-[#D65A24]">{cellAnalysis.yLabel}: {d.y}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Scatter data={cellAnalysis.scatterData} fill="#D65A24" opacity={0.6} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center text-xs text-[#74766F]">
                    Click any cell in the heatmap matrix to view detailed correlation statistics and regression scatter.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 5. Section B: Study Time vs Final Grade (Interactive Scatter with Click Inspector) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#292F2A]">
                  B. Weekly Study Time vs Final Grade
                </h2>
                <p className="text-xs text-[#74766F]">
                  Explore individual student records across study tiers (&lt;2h, 2–5h, 5–10h, &gt;10h). Click any data point to inspect that student.
                </p>
              </div>

              {/* Point Color Mode */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#74766F]">Color Points By:</span>
                <div className="flex border border-[#E7E1D6] rounded bg-white p-0.5">
                  <button
                    onClick={() => setStudyColorMode('subject')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      studyColorMode === 'subject' ? 'bg-[#203B2F] text-white' : 'text-[#74766F] hover:text-[#292F2A]'
                    }`}
                  >
                    Subject (Math / Por)
                  </button>
                  <button
                    onClick={() => setStudyColorMode('sex')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      studyColorMode === 'sex' ? 'bg-[#203B2F] text-white' : 'text-[#74766F] hover:text-[#292F2A]'
                    }`}
                  >
                    Gender (F / M)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Scatter Chart (8 or 9 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#E7E1D6] rounded-lg p-5">
                <div className="flex justify-between items-center text-xs text-[#74766F] mb-3">
                  <span>Linear Slope: <strong className="font-data text-[#D65A24]">{studyRegression.equation}</strong> (R² = {studyRegression.r2})</span>
                  <span>Click any point to open student details</span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                      <XAxis 
                        dataKey="displayX" 
                        name="Study Time" 
                        domain={[0.5, 4.5]}
                        ticks={[1, 2, 3, 4]}
                        tickFormatter={(val) => val === 1 ? '< 2 hrs' : val === 2 ? '2–5 hrs' : val === 3 ? '5–10 hrs' : '> 10 hrs'}
                        stroke="#74766F" 
                        tick={{ fontSize: 11, fill: '#74766F' }}
                      />
                      <YAxis 
                        dataKey="grade" 
                        name="Final Grade (G3)" 
                        domain={[0, 20]} 
                        stroke="#74766F" 
                        tick={{ fontSize: 11, fill: '#74766F' }} 
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white border border-[#E7E1D6] p-2.5 rounded shadow-md text-xs">
                                <p className="font-bold text-[#292F2A]">{d.id} ({d.subject})</p>
                                <p className="text-[#D65A24]">Final Grade: {d.grade} / 20</p>
                                <p className="text-[#74766F]">Absences: {d.absences} d · Failures: {d.failures}</p>
                                <p className="text-[10px] text-[#203B2F] mt-1 font-semibold">Click to select record</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter 
                        data={studyScatterData} 
                        onClick={(e: any) => {
                          const record = e?.payload?.fullRecord || e?.fullRecord;
                          if (record) setInspectedStudent(record);
                        }}
                      >
                        {studyScatterData.map((entry, index) => {
                          let color = '#203B2F';
                          if (studyColorMode === 'subject') {
                            color = entry.subject === 'Mathematics' ? '#D65A24' : '#203B2F';
                          } else {
                            color = entry.sex === 'F' ? '#D65A24' : '#203B2F';
                          }
                          return <Cell key={`cell-${index}`} fill={color} opacity={0.65} />;
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs text-[#74766F] mt-3 pt-3 border-t border-[#E7E1D6]">
                  <div className="flex items-center space-x-4">
                    {studyColorMode === 'subject' ? (
                      <>
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D65A24]" />
                          <span>Mathematics</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#203B2F]" />
                          <span>Portuguese</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D65A24]" />
                          <span>Female (F)</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#203B2F]" />
                          <span>Male (M)</span>
                        </span>
                      </>
                    )}
                  </div>
                  <span>Points slightly jittered horizontally for density visibility</span>
                </div>
              </div>

              {/* Inspected Record Card (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#E7E1D6] rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#74766F]">
                    Student Point Inspector
                  </span>
                  {inspectedStudent && (
                    <button onClick={() => setInspectedStudent(null)} className="text-[#74766F] hover:text-[#292F2A]">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {inspectedStudent ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-[#292F2A]">
                          Record #{inspectedStudent.id}
                        </h4>
                        <p className="text-[11px] text-[#74766F]">
                          {inspectedStudent.subject} · School {inspectedStudent.school} · Age {inspectedStudent.age} ({inspectedStudent.sex})
                        </p>
                      </div>
                      <span className={`font-data font-bold text-lg px-2 py-0.5 rounded ${
                        inspectedStudent.G3 >= 10 ? 'bg-[#DCE5D8] text-[#203B2F]' : 'bg-[#F3D6C2] text-[#D65A24]'
                      }`}>
                        {inspectedStudent.G3} / 20
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-[#FAF7F0] rounded border border-[#E7E1D6]">
                        <span className="text-[#74766F] block">Study Category</span>
                        <span className="font-semibold text-[#292F2A]">
                          {inspectedStudent.studytime === 1 ? '< 2 hrs' : inspectedStudent.studytime === 2 ? '2–5 hrs' : inspectedStudent.studytime === 3 ? '5–10 hrs' : '> 10 hrs'}
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] rounded border border-[#E7E1D6]">
                        <span className="text-[#74766F] block">Absences</span>
                        <span className="font-semibold text-[#D65A24] font-data">{inspectedStudent.absences} days</span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] rounded border border-[#E7E1D6]">
                        <span className="text-[#74766F] block">Prior Failures</span>
                        <span className="font-semibold text-[#292F2A] font-data">{inspectedStudent.failures}</span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] rounded border border-[#E7E1D6]">
                        <span className="text-[#74766F] block">G1 → G2 Marks</span>
                        <span className="font-semibold text-[#203B2F] font-data">{inspectedStudent.G1} → {inspectedStudent.G2}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedStudentRecord(inspectedStudent)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 bg-[#203B2F] hover:bg-[#172c23] text-white rounded font-medium text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Full Student Profile</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#74766F]">
                    Click any point in the scatter plot to inspect that student's full academic and behavioral profile.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 6. Section C & D: Absences Tiers & Previous Failures (Interactive Group Cross-Filtering) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section C: Absences vs Final Grade with Clickable Tiers */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292F2A]">
                    C. Absences vs Final Grade
                  </h2>
                  <p className="text-xs text-[#74766F]">
                    Click an absence tier card to cross-filter the workspace.
                  </p>
                </div>
                {selectedAbsenceTier && (
                  <button 
                    onClick={() => setSelectedAbsenceTier(null)}
                    className="text-xs text-[#D65A24] hover:underline font-medium"
                  >
                    Clear Tier Selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {absenceTiersData.map(tier => (
                  <button
                    key={tier.key}
                    onClick={() => setSelectedAbsenceTier(selectedAbsenceTier === tier.key ? null : tier.key)}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      tier.isSelected 
                        ? 'bg-[#203B2F] text-white border-[#203B2F] shadow-sm' 
                        : 'bg-white border-[#E7E1D6] hover:border-[#203B2F] text-[#292F2A]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold">{tier.label}</span>
                      <span className="font-data opacity-80">n={tier.count}</span>
                    </div>
                    <div className={`font-heading text-xl font-bold ${tier.isSelected ? 'text-white' : 'text-[#D65A24]'}`}>
                      {tier.averageGrade}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">Pass: {tier.passRate}%</div>
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 border border-[#E7E1D6] rounded-lg">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={absenceTiersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                      <XAxis dataKey="label" stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <YAxis domain={[0, 20]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E1D6', borderRadius: '6px', fontSize: '12px' }}
                      />
                      <Bar 
                        dataKey="averageGrade" 
                        name="Average Final Grade (/20)" 
                        fill="#D65A24" 
                        radius={[2, 2, 0, 0]}
                        onClick={(entry: any) => {
                          const k = entry?.key ?? entry?.payload?.key;
                          if (k !== undefined && k !== null) {
                            setSelectedAbsenceTier(selectedAbsenceTier === String(k) ? null : String(k));
                          }
                        }}
                      >
                        {absenceTiersData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isSelected ? '#203B2F' : '#D65A24'} 
                            cursor="pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Section D: Previous Failures vs Final Grade */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292F2A]">
                    D. Previous Failures vs Final Grade
                  </h2>
                  <p className="text-xs text-[#74766F]">
                    Click any failure level to cross-filter the workspace.
                  </p>
                </div>
                {selectedFailureGroup !== null && (
                  <button 
                    onClick={() => setSelectedFailureGroup(null)}
                    className="text-xs text-[#D65A24] hover:underline font-medium"
                  >
                    Clear Failure Selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {failuresData.map(group => (
                  <button
                    key={group.failureCount}
                    onClick={() => setSelectedFailureGroup(selectedFailureGroup === group.failureCount ? null : group.failureCount)}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      group.isSelected 
                        ? 'bg-[#D65A24] text-white border-[#D65A24] shadow-sm' 
                        : 'bg-white border-[#E7E1D6] hover:border-[#D65A24] text-[#292F2A]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold">{group.label}</span>
                      <span className="font-data opacity-80">n={group.count}</span>
                    </div>
                    <div className={`font-heading text-xl font-bold ${group.isSelected ? 'text-white' : 'text-[#203B2F]'}`}>
                      {group.mean}
                    </div>
                    <div className="text-[10px] opacity-75 mt-0.5">Pass: {group.passRate}%</div>
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 border border-[#E7E1D6] rounded-lg">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={failuresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                      <XAxis dataKey="label" stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <YAxis domain={[0, 20]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E1D6', borderRadius: '6px', fontSize: '12px' }}
                      />
                      <Bar 
                        dataKey="mean" 
                        name="Average Final Grade (/20)" 
                        fill="#203B2F" 
                        radius={[2, 2, 0, 0]}
                        onClick={(entry: any) => {
                          const f = entry?.failureCount ?? entry?.payload?.failureCount;
                          if (f !== undefined && f !== null) {
                            setSelectedFailureGroup(selectedFailureGroup === Number(f) ? null : Number(f));
                          }
                        }}
                      >
                        {failuresData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isSelected ? '#D65A24' : '#203B2F'} 
                            cursor="pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Section E: Other Relevant Factors (Interactive Category Tabs) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#292F2A]">
                  E. Other Relevant Socioeconomic & Support Factors
                </h2>
                <p className="text-xs text-[#74766F]">
                  Select a factor domain to investigate group mean comparisons and sample sizes.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1 border border-[#E7E1D6] rounded bg-white p-1 text-xs">
                {[
                  { id: 'support', label: 'School & Family Support' },
                  { id: 'parentEdu', label: "Parental Education" },
                  { id: 'internet', label: 'Home Internet' },
                  { id: 'higher', label: 'Higher Ed Goal' },
                  { id: 'travel', label: 'Travel Time' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOtherFactorTab(tab.id as any)}
                    className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                      otherFactorTab === tab.id 
                        ? 'bg-[#203B2F] text-white' 
                        : 'text-[#74766F] hover:text-[#292F2A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E7E1D6] rounded-lg p-5">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {otherFactorTab === 'parentEdu' ? (
                    <BarChart data={otherFactorData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                      <XAxis dataKey="group" stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <YAxis domain={[0, 20]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E1D6', borderRadius: '6px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                      <Bar dataKey="Mother" name="Mother's Education" fill="#D65A24" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Father" name="Father's Education" fill="#203B2F" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={otherFactorData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                      <XAxis dataKey="group" stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <YAxis domain={[0, 20]} stroke="#74766F" tick={{ fontSize: 11, fill: '#74766F' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E1D6', borderRadius: '6px', fontSize: '12px' }}
                      />
                      <Bar dataKey="mean" name="Average Grade (/20)" fill="#203B2F" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {otherFactorTab === 'support' && (
                <div className="mt-4 p-3.5 bg-[#FAF7F0] rounded border border-[#E7E1D6] text-xs text-[#74766F]">
                  <strong className="text-[#292F2A]">The Compensatory Support Note:</strong> Students receiving remedial school educational support (<code className="text-[#D65A24] font-data">schoolsup = yes</code>) average 9.5 marks compared to 11.6 for those without support. In observational secondary data, remedial support is assigned to struggling students; this does <em>not</em> mean support causes lower grades.
                </div>
              )}
            </div>
          </section>

          {/* 8. Section F: Interactive Custom Factor Comparison */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#292F2A]">
                  F. Custom Bivariate Comparison Lab
                </h2>
                <p className="text-xs text-[#74766F]">
                  Choose any X-axis variable, Y-axis outcome, and grouping to run your own interactive regression comparison.
                </p>
              </div>

              {/* Selector Controls */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#74766F]">X:</span>
                  <select
                    value={compareVarX as string}
                    onChange={e => setCompareVarX(e.target.value as any)}
                    className="bg-white border border-[#E7E1D6] rounded px-2 py-1 text-xs text-[#292F2A] font-medium"
                  >
                    {ALL_NUMERIC_VARS.map(v => (
                      <option key={v.key as string} value={v.key as string}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[#74766F]">Y:</span>
                  <select
                    value={compareVarY as string}
                    onChange={e => setCompareVarY(e.target.value as any)}
                    className="bg-white border border-[#E7E1D6] rounded px-2 py-1 text-xs text-[#292F2A] font-medium"
                  >
                    {ALL_NUMERIC_VARS.map(v => (
                      <option key={v.key as string} value={v.key as string}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[#74766F]">Group:</span>
                  <select
                    value={compareGroupVar}
                    onChange={e => setCompareGroupVar(e.target.value as any)}
                    className="bg-white border border-[#E7E1D6] rounded px-2 py-1 text-xs text-[#292F2A] font-medium"
                  >
                    <option value="none">No Grouping</option>
                    <option value="subject">Subject (Math / Por)</option>
                    <option value="sex">Gender (F / M)</option>
                    <option value="school">School (GP / MS)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E7E1D6] rounded-lg p-5">
              <div className="flex justify-between items-center text-xs text-[#74766F] mb-3">
                <span>Regression: <strong className="font-data text-[#D65A24]">{customComparePlot.reg.equation}</strong> (R² = {customComparePlot.reg.r2})</span>
                <span>Correlation: <strong className="font-data text-[#203B2F]">r = {customComparePlot.corr.toFixed(3)}</strong></span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                    <XAxis 
                      dataKey="x" 
                      name={customComparePlot.xLabel} 
                      stroke="#74766F" 
                      tick={{ fontSize: 11, fill: '#74766F' }}
                      label={{ value: customComparePlot.xLabel, position: 'insideBottom', offset: -10, fontSize: 11, fill: '#74766F' }}
                    />
                    <YAxis 
                      dataKey="y" 
                      name={customComparePlot.yLabel} 
                      stroke="#74766F" 
                      tick={{ fontSize: 11, fill: '#74766F' }} 
                      label={{ value: customComparePlot.yLabel, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#74766F' }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white border border-[#E7E1D6] p-2.5 rounded shadow-xs text-xs">
                              <p className="font-bold text-[#292F2A]">{d.id} ({d.group})</p>
                              <p className="text-[#74766F]">{customComparePlot.xLabel}: {d.x.toFixed(1)}</p>
                              <p className="text-[#D65A24]">{customComparePlot.yLabel}: {d.y}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      data={customComparePlot.data} 
                      onClick={(e: any) => {
                        const record = e?.payload?.fullRecord || e?.fullRecord;
                        if (record) setInspectedStudent(record);
                      }}
                    >
                      {customComparePlot.data.map((entry, index) => {
                        const color = entry.group === 'Mathematics' || entry.group === 'F' ? '#D65A24' : '#203B2F';
                        return <Cell key={`custom-cell-${index}`} fill={color} opacity={0.6} cursor="pointer" />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-[#74766F] mt-3 pt-2 border-t border-[#E7E1D6]">
                Clicking any data point in the custom chart will load that student's record into the inspector card above.
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
