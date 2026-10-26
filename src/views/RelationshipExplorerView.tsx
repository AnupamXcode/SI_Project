import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  calculatePearsonCorrelation, 
  calculateSpearmanCorrelation, 
  calculateLinearRegression 
} from '../utils/statistics';
import { StudentRecord } from '../types/student';
import { Compass, Info, ShieldAlert, ArrowUpDown, ChevronRight } from 'lucide-react';

interface VariableDef {
  key: keyof StudentRecord;
  label: string;
  category: 'academic' | 'habits' | 'social';
  description: string;
}

const ANALYZABLE_VARIABLES: VariableDef[] = [
  { key: 'G3', label: 'Final Grade (G3)', category: 'academic', description: 'Final examination mark (0–20)' },
  { key: 'G1', label: 'Period 1 Grade (G1)', category: 'academic', description: 'First trimester evaluation (0–20)' },
  { key: 'G2', label: 'Period 2 Grade (G2)', category: 'academic', description: 'Second trimester evaluation (0–20)' },
  { key: 'failures', label: 'Past Failures', category: 'academic', description: 'Number of past class failures (0–3+)' },
  { key: 'studytime', label: 'Weekly Study Time', category: 'habits', description: 'Study hours: 1 (<2h) to 4 (>10h)' },
  { key: 'absences', label: 'School Absences', category: 'habits', description: 'Days of absence from school (0–93)' },
  { key: 'traveltime', label: 'Travel Time', category: 'habits', description: 'Commute time: 1 (<15m) to 4 (>1h)' },
  { key: 'Medu', label: "Mother's Education", category: 'social', description: '0 (None) to 4 (Higher Education)' },
  { key: 'Fedu', label: "Father's Education", category: 'social', description: '0 (None) to 4 (Higher Education)' },
  { key: 'famrel', label: 'Family Relations', category: 'social', description: 'Quality scale: 1 (bad) to 5 (excellent)' },
  { key: 'freetime', label: 'Free Time', category: 'habits', description: 'After school free time: 1 (low) to 5 (high)' },
  { key: 'goout', label: 'Going Out', category: 'habits', description: 'Going out with friends: 1 (low) to 5 (high)' },
  { key: 'Dalc', label: 'Workday Alcohol', category: 'social', description: 'Daily alcohol intake: 1 (very low) to 5 (high)' },
  { key: 'Walc', label: 'Weekend Alcohol', category: 'social', description: 'Weekend alcohol intake: 1 (low) to 5 (high)' },
  { key: 'health', label: 'Health Status', category: 'social', description: 'Current health scale: 1 (bad) to 5 (good)' }
];

export const RelationshipExplorerView: React.FC = () => {
  const { filteredRecords } = useData();
  const [method, setMethod] = useState<'pearson' | 'spearman'>('pearson');
  const [varX, setVarX] = useState<keyof StudentRecord>('G1');
  const [varY, setVarY] = useState<keyof StudentRecord>('G3');
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'habits' | 'social'>('all');

  // Filter variable pool for heatmap
  const visibleVariables = useMemo(() => {
    if (activeCategory === 'all') return ANALYZABLE_VARIABLES;
    return ANALYZABLE_VARIABLES.filter(v => v.category === activeCategory || v.key === 'G3');
  }, [activeCategory]);

  // Compute correlation matrix
  const correlationMatrix = useMemo(() => {
    const keys = visibleVariables.map(v => v.key);
    const matrix: { [key: string]: { [key: string]: number } } = {};

    keys.forEach(k1 => {
      matrix[k1 as string] = {};
      const xVals = filteredRecords.map(r => Number(r[k1]));

      keys.forEach(k2 => {
        const yVals = filteredRecords.map(r => Number(r[k2]));
        const val = method === 'pearson' 
          ? calculatePearsonCorrelation(xVals, yVals)
          : calculateSpearmanCorrelation(xVals, yVals);
        matrix[k1 as string][k2 as string] = val;
      });
    });

    return matrix;
  }, [visibleVariables, filteredRecords, method]);

  // Selected Variable Pair Scatter Data & Regression
  const pairScatterData = useMemo(() => {
    return filteredRecords.map(r => ({
      x: Number(r[varX]),
      y: Number(r[varY]),
      id: r.id,
      subject: r.subject
    }));
  }, [filteredRecords, varX, varY]);

  const pairRegression = useMemo(() => {
    const x = filteredRecords.map(r => Number(r[varX]));
    const y = filteredRecords.map(r => Number(r[varY]));
    const corr = method === 'pearson' ? calculatePearsonCorrelation(x, y) : calculateSpearmanCorrelation(x, y);
    const reg = calculateLinearRegression(x, y);
    return { ...reg, correlation: corr };
  }, [filteredRecords, varX, varY, method]);

  const varXDef = ANALYZABLE_VARIABLES.find(v => v.key === varX);
  const varYDef = ANALYZABLE_VARIABLES.find(v => v.key === varY);

  // Helper color scale for correlation cells
  const getCellColor = (val: number) => {
    if (val === 1) return '#17382B text-white font-bold';
    if (val > 0.6) return 'bg-[#17382B]/85 text-white font-semibold';
    if (val > 0.3) return 'bg-[#17382B]/45 text-[#17382B] font-semibold';
    if (val > 0.1) return 'bg-[#8FA58A]/30 text-[#17382B]';
    if (val > -0.1) return 'bg-[#FAF7EE] text-[#7A8880]';
    if (val > -0.3) return 'bg-[#C55A38]/30 text-[#C55A38]';
    return 'bg-[#C55A38]/80 text-white font-semibold';
  };

  return (
    <div className="space-y-8">
      <EditorialHeader
        kicker="Relationship Explorer"
        title="Bivariate Correlation & Trend Analysis"
        description="Investigate pairwise statistical associations, linear regressions, and rank-order dependencies across continuous and ordinal attributes."
        tags={[
          { label: `Metric: ${method === 'pearson' ? "Pearson's r (Linear)" : 'Spearman’s ρ (Monotonic)'}`, color: 'green' },
          { label: `Pairwise Sample: ${filteredRecords.length}`, color: 'gold' }
        ]}
      >
        <div className="flex bg-[#EAE6D8] p-1 rounded-xl border border-[#DCD6C5] text-xs font-semibold">
          <button
            onClick={() => setMethod('pearson')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              method === 'pearson' ? 'bg-[#17382B] text-white shadow-xs' : 'text-[#5A6861] hover:text-[#17382B]'
            }`}
          >
            Pearson r (Parametric)
          </button>
          <button
            onClick={() => setMethod('spearman')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              method === 'spearman' ? 'bg-[#17382B] text-white shadow-xs' : 'text-[#5A6861] hover:text-[#17382B]'
            }`}
          >
            Spearman ρ (Rank-Order)
          </button>
        </div>
      </EditorialHeader>

      {/* Main Heatmap Matrix */}
      <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
              Inter-Variable Heatmap
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
              Correlation Matrix ({method.toUpperCase()})
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAF7EE] p-1 rounded-lg border border-[#E5DFCE] text-xs font-medium">
            {(['all', 'academic', 'habits', 'social'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-[#17382B] text-white shadow-xs'
                    : 'text-[#68736B] hover:text-[#17382B]'
                }`}
              >
                {cat === 'all' ? 'All Variables' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left font-semibold text-[#17382B] border-b border-[#E0DACB] bg-[#FAF7EE] sticky left-0 z-10">
                  Variable
                </th>
                {visibleVariables.map(v => (
                  <th
                    key={v.key as string}
                    className="p-2 font-mono-data font-semibold text-center text-[#17382B] border-b border-[#E0DACB] bg-[#FAF7EE] whitespace-nowrap min-w-[70px]"
                  >
                    {v.key as string}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleVariables.map(rowVar => (
                <tr key={rowVar.key as string} className="hover:bg-[#F8F5EC]">
                  <td className="p-2 text-left font-medium text-[#17382B] border-b border-[#EAE4D5] bg-[#FAF7EE] sticky left-0 z-10 whitespace-nowrap">
                    {rowVar.label}
                  </td>
                  {visibleVariables.map(colVar => {
                    const val = correlationMatrix[rowVar.key as string]?.[colVar.key as string] ?? 0;
                    return (
                      <td
                        key={colVar.key as string}
                        onClick={() => {
                          setVarX(colVar.key);
                          setVarY(rowVar.key);
                        }}
                        title={`Click to plot: ${rowVar.label} vs ${colVar.label} (${val})`}
                        className={`p-2 text-center font-mono-data border-b border-r border-[#EAE4D5] cursor-pointer transition-colors ${getCellColor(val)}`}
                      >
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-[#7A8880] mt-3 pt-3 border-t border-[#EAE4D5] gap-2">
          <span>Click any cell to immediately inspect the variable pair in the scatter lab below.</span>
          <div className="flex items-center space-x-2 font-mono-data text-[11px]">
            <span className="inline-block w-3 h-3 bg-[#17382B] rounded-xs" /> Positive r &gt; 0.6
            <span className="inline-block w-3 h-3 bg-[#8FA58A] rounded-xs ml-2" /> Weak Positive
            <span className="inline-block w-3 h-3 bg-[#C55A38] rounded-xs ml-2" /> Negative r &lt; -0.3
          </div>
        </div>
      </div>

      {/* Variable Pair Inspector & Linear Regression Plot */}
      <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 pb-4 border-b border-[#EAE4D5] gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
              Targeted Bivariate Model
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
              {varXDef?.label} vs. {varYDef?.label}
            </h3>
            <p className="text-xs text-[#68736B]">
              Examining empirical regression: <strong>{pairRegression.equation}</strong> · <strong>R² = {pairRegression.r2}</strong>
            </p>
          </div>

          {/* Selectors for X and Y */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-xs">
              <span className="text-[10px] text-[#68736B] uppercase font-bold">X-Axis (Independent)</span>
              <select
                value={varX as string}
                onChange={e => setVarX(e.target.value as any)}
                className="bg-[#FAF7EE] border border-[#D5CFBF] p-1.5 rounded-lg text-xs font-medium text-[#17382B]"
              >
                {ANALYZABLE_VARIABLES.map(v => (
                  <option key={v.key as string} value={v.key as string}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <ChevronRight className="w-4 h-4 text-[#8FA58A] mt-3" />

            <div className="flex flex-col text-xs">
              <span className="text-[10px] text-[#68736B] uppercase font-bold">Y-Axis (Dependent)</span>
              <select
                value={varY as string}
                onChange={e => setVarY(e.target.value as any)}
                className="bg-[#FAF7EE] border border-[#D5CFBF] p-1.5 rounded-lg text-xs font-medium text-[#17382B]"
              >
                {ANALYZABLE_VARIABLES.map(v => (
                  <option key={v.key as string} value={v.key as string}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scatter Chart */}
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DA" />
              <XAxis 
                dataKey="x" 
                name={varXDef?.label} 
                stroke="#68736B" 
                label={{ value: varXDef?.label, position: 'insideBottom', offset: -10, fontSize: 11, fill: '#17382B' }} 
              />
              <YAxis 
                dataKey="y" 
                name={varYDef?.label} 
                stroke="#68736B" 
                label={{ value: varYDef?.label, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#17382B' }} 
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#FFFDF9] border border-[#D4CEBF] p-3 rounded-xl text-xs shadow-md">
                        <p className="font-bold text-[#17382B]">{data.id} ({data.subject})</p>
                        <p className="text-[#C55A38]">{varXDef?.label}: <strong>{data.x}</strong></p>
                        <p className="text-[#17382B]">{varYDef?.label}: <strong>{data.y}</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Students" data={pairScatterData} fill="#17382B" opacity={0.65} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Analytical Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EAE4D5] text-xs">
          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E9E2D2]">
            <span className="text-[#68736B] block">Correlation Magnitude</span>
            <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
              r = {pairRegression.correlation}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-0.5">
              {Math.abs(pairRegression.correlation) > 0.7 
                ? 'Strong linear relationship' 
                : Math.abs(pairRegression.correlation) > 0.3 
                ? 'Moderate correlation' 
                : 'Weak or negligible linear link'}
            </span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E9E2D2]">
            <span className="text-[#68736B] block">Coefficient of Determination</span>
            <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
              R² = {pairRegression.r2}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-0.5">
              Explains {(pairRegression.r2 * 100).toFixed(1)}% of variance in {varYDef?.key as string}
            </span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E9E2D2]">
            <span className="text-[#68736B] block">Linear Slope & Intercept</span>
            <span className="font-serif-editorial text-xl font-bold text-[#D9A441]">
              β = {pairRegression.slope}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-0.5">
              Intercept at {pairRegression.intercept}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
