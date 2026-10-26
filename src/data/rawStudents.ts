import mathData from './mathStudents.json';
import porData from './portugueseStudents.json';
import { StudentRecord } from '../types/student';

export const RAW_MATH_STUDENTS: StudentRecord[] = mathData as StudentRecord[];
export const RAW_POR_STUDENTS: StudentRecord[] = porData as StudentRecord[];

export const RAW_ALL_STUDENTS: StudentRecord[] = [
  ...RAW_MATH_STUDENTS,
  ...RAW_POR_STUDENTS
];

export const DATASET_METADATA = {
  title: 'Secondary Student Performance Dataset',
  citation: 'P. Cortez and A. Silva. Using Data Mining to Predict Secondary School Student Performance. EUROSIS-ETI, 2008.',
  sourceUrl: 'https://archive.ics.uci.edu/dataset/320/student+performance',
  mathCount: RAW_MATH_STUDENTS.length,
  porCount: RAW_POR_STUDENTS.length,
  totalEnrollments: RAW_ALL_STUDENTS.length,
  overlapCount: 382,
  schools: {
    GP: 'Gabriel Pereira (Urban secondary school in Évora, Portugal)',
    MS: 'Mousinho da Silveira (Secondary school in Portalegre, Portugal)'
  },
  gradingScale: {
    min: 0,
    max: 20,
    passThreshold: 10,
    bands: [
      { label: 'Fail / Insufficient', min: 0, max: 9, description: 'Did not meet passing criteria' },
      { label: 'Suficiente (Pass)', min: 10, max: 13, description: 'Basic passing standard' },
      { label: 'Bom (Good)', min: 14, max: 15, description: 'Above average competence' },
      { label: 'Notável (Very Good)', min: 16, max: 17, description: 'High academic distinction' },
      { label: 'Excelente (Excellent)', min: 18, max: 20, description: 'Exceptional academic mastery' }
    ]
  }
};
