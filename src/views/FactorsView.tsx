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
import { calculateDescriptive, calculatePearsonCorrelation } from '../utils/statistics';
import { StudentRecord } from '../types/student';

const CORRELATION_VARS: { key: keyof StudentRecord; label: string }[] = [
  { key: 'G3', label: 'Final Grade (G3)' },
  { key: 'G1', label: 'Period 1 (G1)' },
  { key: 'G2', label: 'Period 2 (G2)' },
  { key: 'studytime', label: 'Study Time' },
  { key: 'failures', label: 'Failures' },
  { key: 'absences', label: 'Absences' },
  { key: 'Medu', label: "Mother's Edu" },
  { key: 'Fedu', label: "Father's Edu" },
  { key: 'traveltime', label: 'Travel Time' },
  { key: 'freetime', label: 'Free Time' },
  { key: 'goout', label: 'Going Out' },
  { key: 'Dalc', label: 'Workday Alcohol' },
  { key: 'health', label: 'Health' },
];

export const FactorsView: React.FC = () => {
  const { allRecords } = useData();

  // Study time comparison data
  const studyTimeData = useMemo(() => {
    const categories = [
      { level: 1, label: '< 2 hrs / week' },
      { level: 2, label: '2 to 5 hrs / week' },
      { level: 3, label: '5 to 10 hrs / week' },
      { level: 4, label: '> 10 hrs / week' },
    ];

    return categories.map(cat => {
      const mathStudents = allRecords.filter(r => r.subject === 'Mathematics' && r.studytime === cat.level);
      const porStudents = allRecords.filter(r => r.subject === 'Portuguese' && r.studytime === cat.level);
      const totalStudents = allRecords.filter(r => r.studytime === cat.level);

      const meanMath = mathStudents.length ? calculateDescriptive(mathStudents.map(r => r.G3)).mean : 0;
      const meanPor = porStudents.length ? calculateDescriptive(porStudents.map(r => r.G3)).mean : 0;
      const meanTotal = totalStudents.length ? calculateDescriptive(totalStudents.map(r => r.G3)).mean : 0;

      return {
        label: cat.label,
        count: totalStudents.length,
        Mathematics: meanMath,
        Portuguese: meanPor,
        Combined: meanTotal,
      };
    });
  }, [allRecords]);

  // Previous failures comparison data
  const failureData = useMemo(() => {
    const failureLevels = [0, 1, 2, 3];
    return failureLevels.map(f => {
      const records = allRecords.filter(r => r.failures === f);
      const desc = calculateDescriptive(records.map(r => r.G3));
      return {
        failures: f === 3 ? '3+ Failures' : `${f} Failures`,
        count: desc.count,
        averageGrade: desc.mean,
        passRate: desc.passRate,
      };
    });
  }, [allRecords]);

  // School Support comparison
  const supportData = useMemo(() => {
    const withSupport = allRecords.filter(r => r.schoolsup === 'yes');
    const withoutSupport = allRecords.filter(r => r.schoolsup === 'no');

    const descWith = calculateDescriptive(withSupport.map(r => r.G3));
    const descWithout = calculateDescriptive(withoutSupport.map(r => r.G3));

    return [
      {
        status: 'Without School Support (n=' + descWithout.count + ')',
        averageGrade: descWithout.mean,
        passRate: descWithout.passRate,
      },
      {
        status: 'With Extra School Support (n=' + descWith.count + ')',
        averageGrade: descWith.mean,
        passRate: descWith.passRate,
      },
    ];
  }, [allRecords]);

  // Correlation Matrix
  const correlationMatrix = useMemo(() => {
    const keys = CORRELATION_VARS.map(v => v.key);
    const matrix: Record<string, Record<string, number>> = {};

    keys.forEach(k1 => {
      matrix[k1 as string] = {};
      const xVals = allRecords.map(r => Number(r[k1]));

      keys.forEach(k2 => {
        const yVals = allRecords.map(r => Number(r[k2]));
        matrix[k1 as string][k2 as string] = calculatePearsonCorrelation(xVals, yVals);
      });
    });

    return matrix;
  }, [allRecords]);

  const getHeatmapColor = (r: number) => {
    if (r === 1) return 'bg-[#456B52] text-white font-bold';
    if (r > 0.4) return 'bg-[#456B52]/80 text-white font-semibold';
    if (r > 0.15) return 'bg-[#DCE8D8] text-[#292D28] font-medium';
    if (r > -0.15) return 'bg-[#FAF8F3] text-[#77776F]';
    if (r > -0.3) return 'bg-[#C77D60]/30 text-[#C77D60] font-medium';
    return 'bg-[#C77D60] text-white font-semibold';
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#292D28] tracking-tight mb-2">
          Factors & Relationships
        </h1>
        <p className="text-sm text-[#77776F] max-w-3xl leading-relaxed">
          Examining associations between academic performance and behavioral, academic history, and contextual features. Note that statistical association does not equal causation.
        </p>
      </div>

      {/* Correlation Heatmap Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#292D28]">
            Correlation Heatmap (Pearson's r)
          </h2>
          <p className="text-xs text-[#77776F]">
            Pairwise correlation coefficients across all 1,044 student records. Values range from -1.0 (inverse) to +1.0 (direct).
          </p>
        </div>

        <div className="bg-white border border-[#E8E4DB] rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium text-[#292D28] bg-[#FAF8F3] sticky left-0 border-b border-[#E8E4DB]">
                  Feature
                </th>
                {CORRELATION_VARS.map(v => (
                  <th
                    key={v.key as string}
                    className="p-2 text-center font-data font-medium text-[#77776F] border-b border-[#E8E4DB] whitespace-nowrap min-w-[55px]"
                  >
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORRELATION_VARS.map(rowVar => (
                <tr key={rowVar.key as string}>
                  <td className="p-2 text-left font-medium text-[#292D28] bg-[#FAF8F3] sticky left-0 border-b border-[#E8E4DB] whitespace-nowrap">
                    {rowVar.label}
                  </td>
                  {CORRELATION_VARS.map(colVar => {
                    const val = correlationMatrix[rowVar.key as string]?.[colVar.key as string] ?? 0;
                    return (
                      <td
                        key={colVar.key as string}
                        className={`p-2 text-center font-data border-b border-r border-[#E8E4DB]/60 ${getHeatmapColor(val)}`}
                      >
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap items-center justify-between text-xs text-[#77776F] mt-4 pt-3 border-t border-[#E8E4DB] gap-3">
            <span className="font-medium text-[#292D28]">Key Correlation Takeaways:</span>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-[#456B52] rounded-xs inline-block" />
                <span>Strong Positive (G1, G2 with G3: r &gt; 0.85)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-[#C77D60] rounded-xs inline-block" />
                <span>Strong Negative (Failures with G3: r = -0.38)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-[#DCE8D8] rounded-xs inline-block" />
                <span>Mild Positive (Study Time: r = +0.16; Mother's Edu: r = +0.20)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Study Time & Previous Failures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Study Time vs Grade */}
        <div className="space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#292D28]">
              Weekly Study Hours vs. Final Mark
            </h2>
            <p className="text-xs text-[#77776F]">
              Average final mark by self-reported weekly study hours.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyTimeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                  <XAxis dataKey="label" stroke="#77776F" tick={{ fontSize: 11, fill: '#77776F' }} />
                  <YAxis domain={[0, 20]} stroke="#77776F" tick={{ fontSize: 11, fill: '#77776F' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E4DB', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Mathematics" fill="#C77D60" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Portuguese" fill="#456B52" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#77776F] mt-3">
              Average grades rise modestly with increased study time (&lt;2 hrs: 10.7 vs &gt;10 hrs: 12.0), but over 50% of students study in Category 2 (2–5 hours).
            </p>
          </div>
        </div>

        {/* Previous Failures Impact */}
        <div className="space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#292D28]">
              Impact of Past Class Failures
            </h2>
            <p className="text-xs text-[#77776F]">
              Final grade average and pass rate grouped by number of prior failed subjects.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E8E4DB]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
                  <XAxis dataKey="failures" stroke="#77776F" tick={{ fontSize: 11, fill: '#77776F' }} />
                  <YAxis domain={[0, 20]} stroke="#77776F" tick={{ fontSize: 11, fill: '#77776F' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E4DB', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Bar dataKey="averageGrade" name="Average Final Grade (/20)" fill="#C77D60" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#77776F] mt-3">
              Students with zero past failures average 11.5 / 20 with an 81.3% pass rate. Those with 3+ past failures average 6.0 / 20 with only a 17.5% pass rate.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Analytical Caveat: Support Paradox & Causation Note */}
      <div className="p-6 bg-white border border-[#E8E4DB] rounded-lg space-y-3">
        <h3 className="font-heading text-base font-bold text-[#292D28]">
          Understanding Correlation vs. Causation in Educational Data
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#77776F] leading-relaxed">
          <div>
            <strong className="text-[#292D28] block mb-1">The Extra Support Paradox:</strong>
            Students receiving extra school educational support (<code className="text-[#C77D60] font-data">schoolsup = yes</code>) have a lower average final grade (9.5) than those without extra support (11.6). This does <em>not</em> mean support harms students. Rather, remedial support is assigned compensatory to students who were already struggling academically.
          </div>

          <div>
            <strong className="text-[#292D28] block mb-1">Causal Boundaries:</strong>
            Variables such as home internet access, parental education, and free time reflect broader socioeconomic context. While they show mild positive correlations with achievement, they cannot be interpreted as independent causal drivers without randomized controlled experimental design.
          </div>
        </div>
      </div>
    </div>
  );
};
