export interface StudentRecord {
  id: string;
  subject: 'Mathematics' | 'Portuguese';
  school: 'GP' | 'MS';
  sex: 'F' | 'M';
  age: number;
  address: 'U' | 'R';
  famsize: 'LE3' | 'GT3';
  Pstatus: 'T' | 'A';
  Medu: number;
  Fedu: number;
  Mjob: 'teacher' | 'health' | 'services' | 'at_home' | 'other';
  Fjob: 'teacher' | 'health' | 'services' | 'at_home' | 'other';
  reason: 'home' | 'reputation' | 'course' | 'other';
  guardian: 'mother' | 'father' | 'other';
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: 'yes' | 'no';
  famsup: 'yes' | 'no';
  paid: 'yes' | 'no';
  activities: 'yes' | 'no';
  nursery: 'yes' | 'no';
  higher: 'yes' | 'no';
  internet: 'yes' | 'no';
  romantic: 'yes' | 'no';
  famrel: number;
  freetime: number;
  goout: number;
  Dalc: number;
  Walc: number;
  health: number;
  absences: number;
  G1: number;
  G2: number;
  G3: number;
}

export type ActiveTab = 'home' | 'analysis' | 'factors' | 'dataset';

export type SubjectFilter = 'all' | 'Mathematics' | 'Portuguese';

export interface FilterState {
  subject: SubjectFilter;
  school: 'all' | 'GP' | 'MS';
  sex: 'all' | 'F' | 'M';
  gradeRange: [number, number];
  absencesRange: [number, number];
  studytime: number[]; // e.g. [1, 2, 3, 4]
  failures: number[];  // e.g. [0, 1, 2, 3]
  schoolsup: 'all' | 'yes' | 'no';
  famsup: 'all' | 'yes' | 'no';
  internet: 'all' | 'yes' | 'no';
  higher: 'all' | 'yes' | 'no';
  searchQuery: string;
}

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  std: number;
  variance: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  passRate: number; // percentage >= 10
  zeroRate: number; // percentage == 0
}

export interface HistogramBin {
  binLabel: string;
  binStart: number;
  binEnd: number;
  count: number;
  density: number;
  mathCount?: number;
  porCount?: number;
}

export interface CorrelationResult {
  var1: string;
  var2: string;
  pearson: number;
  spearman: number;
  sampleSize: number;
}
