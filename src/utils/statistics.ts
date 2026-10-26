import { StudentRecord, DescriptiveStats, HistogramBin } from '../types/student';

/**
 * Robust statistical calculations for empirical research
 */

export function calculateDescriptive(values: number[]): DescriptiveStats {
  const n = values.length;
  if (n === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      std: 0,
      variance: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
      passRate: 0,
      zeroRate: 0
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Median
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];

  // Variance & Standard Deviation (Sample n-1)
  const sqDiffSum = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = n > 1 ? sqDiffSum / (n - 1) : 0;
  const std = Math.sqrt(variance);

  // Percentiles (Tukey method)
  const getPercentile = (p: number) => {
    const pos = (n - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  // Fisher-Pearson Skewness
  let m3 = 0;
  for (const v of sorted) {
    m3 += Math.pow(v - mean, 3);
  }
  m3 /= n;
  const skewness = std > 0 && n > 2 ? m3 / Math.pow(std, 3) : 0;

  const passCount = sorted.filter(v => v >= 10).length;
  const zeroCount = sorted.filter(v => v === 0).length;

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    std: Number(std.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min: sorted[0],
    max: sorted[n - 1],
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    skewness: Number(skewness.toFixed(3)),
    passRate: Number(((passCount / n) * 100).toFixed(1)),
    zeroRate: Number(((zeroCount / n) * 100).toFixed(1))
  };
}

export function calculateBoxPlotStats(values: number[]) {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, lowerFence: 0, upperFence: 0, outliers: [] };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const desc = calculateDescriptive(values);
  const q1 = desc.q1;
  const q3 = desc.q3;
  const iqr = q3 - q1;
  const lowerFence = Math.max(desc.min, q1 - 1.5 * iqr);
  const upperFence = Math.min(desc.max, q3 + 1.5 * iqr);

  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

  return {
    min: desc.min,
    q1,
    median: desc.median,
    q3,
    max: desc.max,
    lowerFence,
    upperFence,
    outliers
  };
}

export function calculateHistogram(
  records: StudentRecord[], 
  gradeKey: 'G1' | 'G2' | 'G3' = 'G3',
  minVal = 0,
  maxVal = 20
): HistogramBin[] {
  const bins: HistogramBin[] = [];
  const total = records.length;
  
  // Exact grades 0 to 20 for integer grading in Portuguese secondary education
  for (let grade = minVal; grade <= maxVal; grade++) {
    const mathInBin = records.filter(r => r.subject === 'Mathematics' && Math.round(r[gradeKey]) === grade).length;
    const porInBin = records.filter(r => r.subject === 'Portuguese' && Math.round(r[gradeKey]) === grade).length;
    const count = mathInBin + porInBin;
    const density = total > 0 ? (count / total) * 100 : 0;

    bins.push({
      binLabel: `${grade}`,
      binStart: grade,
      binEnd: grade,
      count,
      density: Number(density.toFixed(1)),
      mathCount: mathInBin,
      porCount: porInBin
    });
  }

  return bins;
}

export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  const r = numerator / denominator;
  return Number(Math.max(-1, Math.min(1, r)).toFixed(3));
}

function rankArray(arr: number[]): number[] {
  const indexed = arr.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  const ranks = new Array(arr.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i;
    while (j < indexed.length - 1 && indexed[j + 1].val === indexed[j].val) {
      j++;
    }
    const averageRank = (i + 1 + (j + 1)) / 2;
    for (let k = i; k <= j; k++) {
      ranks[indexed[k].idx] = averageRank;
    }
    i = j + 1;
  }
  return ranks;
}

export function calculateSpearmanCorrelation(x: number[], y: number[]): number {
  if (x.length < 3 || y.length < 3) return 0;
  const rankX = rankArray(x);
  const rankY = rankArray(y);
  return calculatePearsonCorrelation(rankX, rankY);
}

export function calculateLinearRegression(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, equation: 'y = 0' };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0, equation: `y = ${(sumY / n).toFixed(2)}` };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const r = calculatePearsonCorrelation(x, y);
  const r2 = Number((r * r).toFixed(3));

  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;

  return {
    slope: Number(slope.toFixed(3)),
    intercept: Number(intercept.toFixed(2)),
    r2,
    equation
  };
}

export function calculateWelchTTest(groupA: number[], groupB: number[]) {
  const n1 = groupA.length;
  const n2 = groupB.length;
  if (n1 < 2 || n2 < 2) {
    return { t: 0, df: 0, pValueEstimate: 1, cohenD: 0, meanDiff: 0, ciLower: 0, ciUpper: 0 };
  }

  const descA = calculateDescriptive(groupA);
  const descB = calculateDescriptive(groupB);

  const meanDiff = descA.mean - descB.mean;
  const se1 = descA.variance / n1;
  const se2 = descB.variance / n2;
  const seDiff = Math.sqrt(se1 + se2);

  const t = seDiff > 0 ? meanDiff / seDiff : 0;
  
  // Welch-Satterthwaite degrees of freedom
  const numDf = Math.pow(se1 + se2, 2);
  const denDf = (Math.pow(se1, 2) / (n1 - 1)) + (Math.pow(se2, 2) / (n2 - 1));
  const df = denDf > 0 ? Math.round(numDf / denDf) : n1 + n2 - 2;

  // Pooled standard deviation for Cohen's d
  const pooledVar = ((n1 - 1) * descA.variance + (n2 - 1) * descB.variance) / (n1 + n2 - 2);
  const pooledSd = Math.sqrt(pooledVar);
  const cohenD = pooledSd > 0 ? meanDiff / pooledSd : 0;

  // Approximate 95% Confidence Interval (t_crit ~ 1.96)
  const margin = 1.96 * seDiff;

  return {
    t: Number(t.toFixed(2)),
    df,
    meanDiff: Number(meanDiff.toFixed(2)),
    seDiff: Number(seDiff.toFixed(2)),
    cohenD: Number(cohenD.toFixed(3)),
    ciLower: Number((meanDiff - margin).toFixed(2)),
    ciUpper: Number((meanDiff + margin).toFixed(2))
  };
}

export function interpretCorrelation(r: number, var1Label: string, var2Label: string): { strength: string; direction: string; text: string } {
  const absR = Math.abs(r);
  const direction = r > 0.05 ? 'positive' : r < -0.05 ? 'negative' : 'negligible';
  let strength = 'negligible';

  if (absR >= 0.7) strength = 'strong';
  else if (absR >= 0.4) strength = 'moderate';
  else if (absR >= 0.15) strength = 'mild';

  let text = '';
  if (r === 1) {
    text = `Perfect identity correlation (${var1Label} with itself).`;
  } else if (absR < 0.08) {
    text = `There is virtually no linear association between ${var1Label} and ${var2Label} (r = ${r.toFixed(2)}).`;
  } else if (r > 0.7) {
    text = `A strong positive linear relationship (r = +${r.toFixed(2)}). Higher values of ${var1Label} strongly track higher values of ${var2Label}. Note that this measures association, not direct causation.`;
  } else if (r > 0.3) {
    text = `A moderate positive relationship (r = +${r.toFixed(2)}). As ${var1Label} increases, ${var2Label} tends to rise, though other confounding factors play a substantial role.`;
  } else if (r > 0) {
    text = `A mild positive correlation (r = +${r.toFixed(2)}). A slight upward tendency is observed, but individual student variability is high.`;
  } else if (r < -0.7) {
    text = `A strong inverse relationship (r = ${r.toFixed(2)}). Increases in ${var1Label} are consistently accompanied by lower values in ${var2Label}.`;
  } else if (r < -0.3) {
    text = `A moderate negative relationship (r = ${r.toFixed(2)}). As ${var1Label} increases, ${var2Label} shows a clear downward tendency.`;
  } else {
    text = `A mild negative correlation (r = ${r.toFixed(2)}). Slight inverse association exists, but cannot be inferred as an isolated cause.`;
  }

  return { strength, direction, text };
}

