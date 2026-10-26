import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { calculateDescriptive, calculateWelchTTest } from '../utils/statistics';
import { GitCompare, AlertTriangle, ShieldCheck, ArrowRight, BarChart3, Info } from 'lucide-react';
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

export const CohortComparisonView: React.FC = () => {
  const { filteredRecords } = useData();
  const [comparisonDimension, setComparisonDimension] = useState<'subject' | 'school' | 'sex' | 'address' | 'higher'>('subject');

  // Compute stats for groups based on selected dimension
  const groupStats = useMemo(() => {
    let groupAName = '';
    let groupBName = '';
    let groupAFilter: (r: any) => boolean = () => true;
    let groupBFilter: (r: any) => boolean = () => true;

    if (comparisonDimension === 'subject') {
      groupAName = 'Mathematics';
      groupBName = 'Portuguese';
      groupAFilter = r => r.subject === 'Mathematics';
      groupBFilter = r => r.subject === 'Portuguese';
    } else if (comparisonDimension === 'school') {
      groupAName = 'Gabriel Pereira (GP)';
      groupBName = 'Mousinho da Silveira (MS)';
      groupAFilter = r => r.school === 'GP';
      groupBFilter = r => r.school === 'MS';
    } else if (comparisonDimension === 'sex') {
      groupAName = 'Female Students (F)';
      groupBName = 'Male Students (M)';
      groupAFilter = r => r.sex === 'F';
      groupBFilter = r => r.sex === 'M';
    } else if (comparisonDimension === 'address') {
      groupAName = 'Urban Address (U)';
      groupBName = 'Rural Address (R)';
      groupAFilter = r => r.address === 'U';
      groupBFilter = r => r.address === 'R';
    } else if (comparisonDimension === 'higher') {
      groupAName = 'Aspires Higher Education';
      groupBName = 'No Higher Education Plan';
      groupAFilter = r => r.higher === 'yes';
      groupBFilter = r => r.higher === 'no';
    }

    const recsA = filteredRecords.filter(groupAFilter);
    const recsB = filteredRecords.filter(groupBFilter);

    const gradesA = recsA.map(r => r.G3);
    const gradesB = recsB.map(r => r.G3);

    const descA = calculateDescriptive(gradesA);
    const descB = calculateDescriptive(gradesB);

    const tTest = calculateWelchTTest(gradesA, gradesB);

    return {
      groupAName,
      groupBName,
      descA,
      descB,
      tTest
    };
  }, [filteredRecords, comparisonDimension]);

  // Chart data comparing the two groups across assessment periods
  const progressionComparison = useMemo(() => {
    const isA = (r: any) => {
      if (comparisonDimension === 'subject') return r.subject === 'Mathematics';
      if (comparisonDimension === 'school') return r.school === 'GP';
      if (comparisonDimension === 'sex') return r.sex === 'F';
      if (comparisonDimension === 'address') return r.address === 'U';
      return r.higher === 'yes';
    };

    const recsA = filteredRecords.filter(isA);
    const recsB = filteredRecords.filter(r => !isA(r));

    const mean = (arr: number[]) => arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0;

    return [
      {
        period: 'Trimester 1 (G1)',
        groupA: mean(recsA.map(r => r.G1)),
        groupB: mean(recsB.map(r => r.G1)),
      },
      {
        period: 'Trimester 2 (G2)',
        groupA: mean(recsA.map(r => r.G2)),
        groupB: mean(recsB.map(r => r.G2)),
      },
      {
        period: 'Final Evaluation (G3)',
        groupA: mean(recsA.map(r => r.G3)),
        groupB: mean(recsB.map(r => r.G3)),
      }
    ];
  }, [filteredRecords, comparisonDimension]);

  return (
    <div className="space-y-8">
      <EditorialHeader
        kicker="Cohort Comparison Studio"
        title="Comparative Statistical Laboratory"
        description="Head-to-head empirical contrast across disciplines, institutions, and demographic strata with Welch’s t-test and Cohen's d effect sizes."
        tags={[
          { label: 'Unpaired Welch t-Test', color: 'green' },
          { label: 'Cohen’s d Effect Size', color: 'terracotta' }
        ]}
      >
        {/* Dimension Selector Pills */}
        <div className="flex bg-[#EAE6D8] p-1 rounded-xl border border-[#DCD6C5] text-xs font-semibold overflow-x-auto">
          {[
            { id: 'subject', label: 'Math vs. Portuguese' },
            { id: 'school', label: 'GP vs. MS School' },
            { id: 'sex', label: 'Gender (F vs. M)' },
            { id: 'address', label: 'Urban vs. Rural' },
            { id: 'higher', label: 'Higher Ed Aspiration' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setComparisonDimension(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                comparisonDimension === opt.id
                  ? 'bg-[#17382B] text-white shadow-xs'
                  : 'text-[#5A6861] hover:text-[#17382B]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </EditorialHeader>

      {/* Critical Overlap Notice when subject comparison is active */}
      {comparisonDimension === 'subject' && (
        <div className="bg-[#FAF6EC] border border-[#E8DFC9] rounded-2xl p-5 flex items-start space-x-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-[#C55A38] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5A6861] space-y-1">
            <strong className="text-[#17382B] text-sm font-serif-editorial block">
              Methodological Audit: The 382 Student Overlap
            </strong>
            <p className="leading-relaxed">
              Caution must be exercised when comparing the Mathematics (n=395) and Portuguese (n=649) datasets. As documented in Cortez & Silva (2008), <strong>382 students are enrolled concurrently in both classes</strong>. Consequently, the two populations are not entirely independent, and unpaired assumptions must be noted during thesis defense.
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group A Card */}
        <div className="bg-paper-card rounded-2xl p-6 border border-[#E9C8BC] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">
              {groupStats.groupAName}
            </span>
            <span className="font-mono-data text-xs bg-[#C55A38]/10 text-[#C55A38] px-2.5 py-0.5 rounded font-bold">
              n = {groupStats.descA.count}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Mean G3 Mark</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#C55A38]">
                {groupStats.descA.mean}
              </span>
              <span className="text-[10px] text-[#8FA58A]">/ 20</span>
            </div>
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Median</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                {groupStats.descA.median}
              </span>
            </div>
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Std Dev</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                {groupStats.descA.std}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#5A6861]">
            <div className="flex justify-between py-1.5 border-b border-[#EAE4D5]">
              <span>Pass Rate (G3 ≥ 10)</span>
              <strong className="text-[#17382B]">{groupStats.descA.passRate}%</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#EAE4D5]">
              <span>Interquartile Range (IQR)</span>
              <strong className="text-[#17382B]">{groupStats.descA.iqr}</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Zero-Grade Percentage</span>
              <strong className="text-[#C55A38]">{groupStats.descA.zeroRate}%</strong>
            </div>
          </div>
        </div>

        {/* Group B Card */}
        <div className="bg-paper-card rounded-2xl p-6 border border-[#C6D6C4] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
              {groupStats.groupBName}
            </span>
            <span className="font-mono-data text-xs bg-[#17382B]/10 text-[#17382B] px-2.5 py-0.5 rounded font-bold">
              n = {groupStats.descB.count}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Mean G3 Mark</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                {groupStats.descB.mean}
              </span>
              <span className="text-[10px] text-[#8FA58A]">/ 20</span>
            </div>
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Median</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                {groupStats.descB.median}
              </span>
            </div>
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#EAE4D5]">
              <span className="text-[10px] text-[#7A8880] block">Std Dev</span>
              <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
                {groupStats.descB.std}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#5A6861]">
            <div className="flex justify-between py-1.5 border-b border-[#EAE4D5]">
              <span>Pass Rate (G3 ≥ 10)</span>
              <strong className="text-[#17382B]">{groupStats.descB.passRate}%</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#EAE4D5]">
              <span>Interquartile Range (IQR)</span>
              <strong className="text-[#17382B]">{groupStats.descB.iqr}</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Zero-Grade Percentage</span>
              <strong className="text-[#17382B]">{groupStats.descB.zeroRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Statistical Test Box: Welch's t-Test & Cohen's d */}
      <div className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#17382B]">
          Inferential Testing
        </span>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-2">
          Welch’s t-Test & Effect Size Estimators
        </h3>
        <p className="text-xs sm:text-sm text-[#68736B] leading-relaxed mb-6">
          Assesses whether the observed mean difference in final grades between groups is statistically distinguishable, accounting for unequal variances and disparate sample sizes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="text-[11px] text-[#68736B] block">Observed Mean Delta (Δ)</span>
            <span className="font-serif-editorial text-2xl font-bold text-[#17382B]">
              {groupStats.tTest.meanDiff > 0 ? `+${groupStats.tTest.meanDiff}` : groupStats.tTest.meanDiff}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-1">SE Diff: ±{groupStats.tTest.seDiff}</span>
          </div>

          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="text-[11px] text-[#68736B] block">Welch's t-Statistic</span>
            <span className="font-serif-editorial text-2xl font-bold text-[#C55A38]">
              t = {groupStats.tTest.t}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-1">df ≈ {groupStats.tTest.df}</span>
          </div>

          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="text-[11px] text-[#68736B] block">Cohen’s d (Effect Size)</span>
            <span className="font-serif-editorial text-2xl font-bold text-[#D9A441]">
              d = {groupStats.tTest.cohenD}
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-1">
              {Math.abs(groupStats.tTest.cohenD) > 0.8 
                ? 'Large Effect' 
                : Math.abs(groupStats.tTest.cohenD) > 0.5 
                ? 'Medium Effect' 
                : Math.abs(groupStats.tTest.cohenD) > 0.2 
                ? 'Small Effect' 
                : 'Negligible Difference'}
            </span>
          </div>

          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="text-[11px] text-[#68736B] block">Approx 95% Confidence Interval</span>
            <span className="font-serif-editorial text-xl font-bold text-[#17382B]">
              [{groupStats.tTest.ciLower}, {groupStats.tTest.ciUpper}]
            </span>
            <span className="text-[10px] text-[#7A8880] block mt-1">Margin: ±{(((groupStats.tTest.seDiff ?? 0)) * 1.96).toFixed(2)}</span>
          </div>
        </div>

        {/* Trimester Comparison Bar Chart */}
        <div>
          <h4 className="font-serif-editorial text-base font-bold text-[#17382B] mb-3">
            Trimester-by-Trimester Grade Progression Comparison
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressionComparison} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DA" />
                <XAxis dataKey="period" stroke="#68736B" tick={{ fontSize: 12, fill: '#68736B' }} />
                <YAxis domain={[0, 20]} stroke="#68736B" tick={{ fontSize: 12, fill: '#68736B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFDF9', borderColor: '#D8D2C2', borderRadius: '10px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="groupA" name={groupStats.groupAName} fill="#C55A38" radius={[4, 4, 0, 0]} />
                <Bar dataKey="groupB" name={groupStats.groupBName} fill="#17382B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
