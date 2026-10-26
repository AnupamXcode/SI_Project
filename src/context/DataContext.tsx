import React, { createContext, useContext, useState, useMemo } from 'react';
import { StudentRecord, ActiveTab, FilterState, DescriptiveStats } from '../types/student';
import { RAW_ALL_STUDENTS, RAW_MATH_STUDENTS, RAW_POR_STUDENTS } from '../data/rawStudents';
import { calculateDescriptive } from '../utils/statistics';

interface DataContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  allRecords: StudentRecord[];
  filteredRecords: StudentRecord[];
  mathRecords: StudentRecord[];
  porRecords: StudentRecord[];
  currentStats: DescriptiveStats;
  mathStats: DescriptiveStats;
  porStats: DescriptiveStats;
  exportFilteredCSV: () => void;
  loadCustomCSV: (file: File) => Promise<boolean>;
  isCustomLoaded: boolean;
  selectedStudentRecord: StudentRecord | null;
  setSelectedStudentRecord: (record: StudentRecord | null) => void;
}

const initialFilters: FilterState = {
  subject: 'all',
  school: 'all',
  sex: 'all',
  gradeRange: [0, 20],
  absencesRange: [0, 93],
  studytime: [1, 2, 3, 4],
  failures: [0, 1, 2, 3],
  schoolsup: 'all',
  famsup: 'all',
  internet: 'all',
  higher: 'all',
  searchQuery: ''
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [customRecords, setCustomRecords] = useState<StudentRecord[] | null>(null);
  const [selectedStudentRecord, setSelectedStudentRecord] = useState<StudentRecord | null>(null);

  const allRecords = useMemo(() => {
    return customRecords || RAW_ALL_STUDENTS;
  }, [customRecords]);

  const mathRecords = useMemo(() => {
    return allRecords.filter(r => r.subject === 'Mathematics');
  }, [allRecords]);

  const porRecords = useMemo(() => {
    return allRecords.filter(r => r.subject === 'Portuguese');
  }, [allRecords]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter(record => {
      // Subject filter
      if (filters.subject !== 'all' && record.subject !== filters.subject) return false;
      // School filter
      if (filters.school !== 'all' && record.school !== filters.school) return false;
      // Sex filter
      if (filters.sex !== 'all' && record.sex !== filters.sex) return false;
      // Grade range (G3)
      if (record.G3 < filters.gradeRange[0] || record.G3 > filters.gradeRange[1]) return false;
      // Absences range
      if (record.absences < filters.absencesRange[0] || record.absences > filters.absencesRange[1]) return false;
      // Study time
      if (!filters.studytime.includes(record.studytime)) return false;
      // Failures
      if (!filters.failures.includes(record.failures)) return false;
      // School support
      if (filters.schoolsup !== 'all' && record.schoolsup !== filters.schoolsup) return false;
      // Family support
      if (filters.famsup !== 'all' && record.famsup !== filters.famsup) return false;
      // Internet access
      if (filters.internet !== 'all' && record.internet !== filters.internet) return false;
      // Higher education ambition
      if (filters.higher !== 'all' && record.higher !== filters.higher) return false;
      // Search query (matches id, school, guardian, jobs)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matches = 
          record.id.toLowerCase().includes(query) ||
          record.school.toLowerCase().includes(query) ||
          record.guardian.toLowerCase().includes(query) ||
          record.Mjob.toLowerCase().includes(query) ||
          record.Fjob.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [allRecords, filters]);

  const currentStats = useMemo(() => {
    return calculateDescriptive(filteredRecords.map(r => r.G3));
  }, [filteredRecords]);

  const mathStats = useMemo(() => {
    const mathFiltered = filteredRecords.filter(r => r.subject === 'Mathematics');
    return calculateDescriptive(mathFiltered.map(r => r.G3));
  }, [filteredRecords]);

  const porStats = useMemo(() => {
    const porFiltered = filteredRecords.filter(r => r.subject === 'Portuguese');
    return calculateDescriptive(porFiltered.map(r => r.G3));
  }, [filteredRecords]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const exportFilteredCSV = () => {
    if (filteredRecords.length === 0) return;
    const headers = Object.keys(filteredRecords[0]).join(',');
    const rows = filteredRecords.map(rec => 
      Object.values(rec).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_intelligence_cohort_${filters.subject}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadCustomCSV = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      import('papaparse').then(({ default: Papa }) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          delimiter: '', // auto-detect ; or ,
          complete: (results) => {
            try {
              const rows = results.data as any[];
              const validRows: StudentRecord[] = [];
              rows.forEach((r, idx) => {
                if (r && r.G3 !== undefined && !isNaN(Number(r.G3))) {
                  validRows.push({
                    id: r.id || `custom_${idx + 1}`,
                    subject: r.subject === 'Portuguese' ? 'Portuguese' : 'Mathematics',
                    school: r.school || 'GP',
                    sex: r.sex || 'F',
                    age: Number(r.age) || 16,
                    address: r.address || 'U',
                    famsize: r.famsize || 'GT3',
                    Pstatus: r.Pstatus || 'T',
                    Medu: Number(r.Medu) || 2,
                    Fedu: Number(r.Fedu) || 2,
                    Mjob: r.Mjob || 'other',
                    Fjob: r.Fjob || 'other',
                    reason: r.reason || 'course',
                    guardian: r.guardian || 'mother',
                    traveltime: Number(r.traveltime) || 1,
                    studytime: Number(r.studytime) || 2,
                    failures: Number(r.failures) || 0,
                    schoolsup: r.schoolsup || 'no',
                    famsup: r.famsup || 'no',
                    paid: r.paid || 'no',
                    activities: r.activities || 'no',
                    nursery: r.nursery || 'yes',
                    higher: r.higher || 'yes',
                    internet: r.internet || 'yes',
                    romantic: r.romantic || 'no',
                    famrel: Number(r.famrel) || 4,
                    freetime: Number(r.freetime) || 3,
                    goout: Number(r.goout) || 3,
                    Dalc: Number(r.Dalc) || 1,
                    Walc: Number(r.Walc) || 1,
                    health: Number(r.health) || 3,
                    absences: Number(r.absences) || 0,
                    G1: Number(r.G1) || 10,
                    G2: Number(r.G2) || 10,
                    G3: Number(r.G3)
                  });
                }
              });

              if (validRows.length > 0) {
                setCustomRecords(validRows);
                resolve(true);
              } else {
                resolve(false);
              }
            } catch (err) {
              console.error(err);
              resolve(false);
            }
          },
          error: () => resolve(false)
        });
      });
    });
  };

  return (
    <DataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        allRecords,
        filteredRecords,
        mathRecords,
        porRecords,
        currentStats,
        mathStats,
        porStats,
        exportFilteredCSV,
        loadCustomCSV,
        isCustomLoaded: customRecords !== null,
        selectedStudentRecord,
        setSelectedStudentRecord
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
