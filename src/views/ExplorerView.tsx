import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { StudentRecord, SubjectFilter } from '../types/student';
import { Search, Download, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const ExplorerView: React.FC = () => {
  const { allRecords, setSelectedStudentRecord } = useData();

  // Simple, useful filters
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('all');
  const [selectedSchool, setSelectedSchool] = useState<'all' | 'GP' | 'MS'>('all');
  const [selectedStudyTime, setSelectedStudyTime] = useState<string>('all');
  const [minGrade, setMinGrade] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Table sorting & pagination
  const [sortColumn, setSortColumn] = useState<keyof StudentRecord>('G3');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Apply filters
  const filteredData = useMemo(() => {
    return allRecords.filter(r => {
      // Subject
      if (selectedSubject !== 'all' && r.subject !== selectedSubject) return false;
      // School
      if (selectedSchool !== 'all' && r.school !== selectedSchool) return false;
      // Study time
      if (selectedStudyTime !== 'all' && r.studytime !== Number(selectedStudyTime)) return false;
      // Min final grade
      if (r.G3 < minGrade) return false;
      // Text search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches = 
          r.id.toLowerCase().includes(q) ||
          r.school.toLowerCase().includes(q) ||
          r.guardian.toLowerCase().includes(q) ||
          r.Mjob.toLowerCase().includes(q) ||
          r.Fjob.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allRecords, selectedSubject, selectedSchool, selectedStudyTime, minGrade, searchQuery]);

  // Apply sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (column: keyof StudentRecord) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleResetFilters = () => {
    setSelectedSubject('all');
    setSelectedSchool('all');
    setSelectedStudyTime('all');
    setMinGrade(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // CSV download for current filtered view
  const downloadFilteredCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(rec =>
      Object.values(rec).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_dataset_filtered_${selectedSubject}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#74766F]">
          OBSERVATIONAL DATA REGISTER
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#26342E] mt-1">
          Dataset <span className="text-[#D95D24]">Explorer</span>
        </h1>
        <p className="text-sm text-[#74766F] max-w-3xl leading-relaxed mt-2">
          Inspect, filter, and export the authentic secondary student records. Every row represents a genuine student record from the UCI dataset without synthetic modifications.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white border border-[#E8E4DB] rounded-lg p-5 space-y-4">
        {/* Row 1: Search & Subject Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Subject Switcher */}
          <div className="flex items-center space-x-1 border border-[#E8E4DB] rounded p-1 bg-[#FAF7F0] text-xs">
            <button
              onClick={() => { setSelectedSubject('all'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded transition-colors ${
                selectedSubject === 'all' ? 'bg-[#173B32] text-white font-medium' : 'text-[#74766F] hover:text-[#26342E]'
              }`}
            >
              All Subjects (1,044)
            </button>
            <button
              onClick={() => { setSelectedSubject('Mathematics'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded transition-colors ${
                selectedSubject === 'Mathematics' ? 'bg-[#D95D24] text-white font-medium' : 'text-[#74766F] hover:text-[#D95D24]'
              }`}
            >
              Mathematics (395)
            </button>
            <button
              onClick={() => { setSelectedSubject('Portuguese'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded transition-colors ${
                selectedSubject === 'Portuguese' ? 'bg-[#173B32] text-white font-medium' : 'text-[#74766F] hover:text-[#173B32]'
              }`}
            >
              Portuguese (649)
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#74766F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, school, job..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F0] border border-[#E8E4DB] rounded text-xs text-[#26342E] focus:outline-hidden focus:border-[#D95D24]"
            />
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E8E4DB] text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* School Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[#74766F]">School:</span>
              <select
                value={selectedSchool}
                onChange={e => { setSelectedSchool(e.target.value as any); setCurrentPage(1); }}
                className="bg-[#FAF7F0] border border-[#E8E4DB] rounded px-2 py-1 text-xs text-[#26342E]"
              >
                <option value="all">All Schools</option>
                <option value="GP">Gabriel Pereira (GP)</option>
                <option value="MS">Mousinho da Silveira (MS)</option>
              </select>
            </div>

            {/* Study Time Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[#74766F]">Weekly Study:</span>
              <select
                value={selectedStudyTime}
                onChange={e => { setSelectedStudyTime(e.target.value); setCurrentPage(1); }}
                className="bg-[#FAF7F0] border border-[#E8E4DB] rounded px-2 py-1 text-xs text-[#26342E]"
              >
                <option value="all">All Study Times</option>
                <option value="1">&lt; 2 hours/week</option>
                <option value="2">2 to 5 hours/week</option>
                <option value="3">5 to 10 hours/week</option>
                <option value="4">&gt; 10 hours/week</option>
              </select>
            </div>

            {/* Minimum Grade */}
            <div className="flex items-center space-x-2">
              <span className="text-[#74766F]">Min Grade (G3 ≥):</span>
              <input
                type="number"
                min="0"
                max="20"
                value={minGrade}
                onChange={e => { setMinGrade(Number(e.target.value)); setCurrentPage(1); }}
                className="w-14 bg-[#FAF7F0] border border-[#E8E4DB] rounded px-2 py-1 text-xs text-[#26342E] font-data text-center"
              />
            </div>

            {/* Reset */}
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 text-xs text-[#D95D24] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>

          {/* Export Action */}
          <button
            onClick={downloadFilteredCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D95D24] hover:bg-[#C24F1D] text-white text-xs font-semibold rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV ({filteredData.length})</span>
          </button>
        </div>
      </div>

      {/* Record Counter */}
      <div className="flex justify-between items-center text-xs text-[#74766F] px-1">
        <span>
          Showing <strong>{paginatedData.length}</strong> of <strong>{filteredData.length}</strong> filtered records
        </span>
        <span>
          Click table headers to sort · Click <Eye className="w-3 h-3 inline mx-0.5 text-[#D95D24]" /> to view student profile
        </span>
      </div>

      {/* Clean Table View */}
      <div className="bg-white border border-[#E8E4DB] rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF7F0] border-b border-[#E8E4DB] text-[#26342E]">
              <th className="py-2.5 px-3 font-semibold">View</th>
              <th 
                onClick={() => handleSort('id')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                ID
              </th>
              <th 
                onClick={() => handleSort('subject')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                Subject
              </th>
              <th 
                onClick={() => handleSort('school')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                School
              </th>
              <th 
                onClick={() => handleSort('sex')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                Sex / Age
              </th>
              <th 
                onClick={() => handleSort('studytime')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                Study Time
              </th>
              <th 
                onClick={() => handleSort('absences')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                Absences
              </th>
              <th 
                onClick={() => handleSort('failures')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                Failures
              </th>
              <th 
                onClick={() => handleSort('G1')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                G1
              </th>
              <th 
                onClick={() => handleSort('G2')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline"
              >
                G2
              </th>
              <th 
                onClick={() => handleSort('G3')} 
                className="py-2.5 px-3 font-semibold cursor-pointer hover:underline bg-[#FAF7F0]/80"
              >
                Final G3 (/20)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DB] text-[#26342E]">
            {paginatedData.map(record => (
              <tr key={record.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                <td className="py-2.5 px-3">
                  <button
                    onClick={() => setSelectedStudentRecord(record)}
                    className="p-1 text-[#D95D24] hover:bg-[#F4D4BD]/40 rounded"
                    title="View individual student details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="py-2.5 px-3 font-data font-medium text-[#74766F]">{record.id}</td>
                <td className="py-2.5 px-3 font-medium">
                  <span className={record.subject === 'Mathematics' ? 'text-[#D95D24]' : 'text-[#173B32]'}>
                    {record.subject}
                  </span>
                </td>
                <td className="py-2.5 px-3">{record.school}</td>
                <td className="py-2.5 px-3">{record.sex} · Age {record.age}</td>
                <td className="py-2.5 px-3">
                  {record.studytime === 1 ? '<2h' : record.studytime === 2 ? '2–5h' : record.studytime === 3 ? '5–10h' : '>10h'}
                </td>
                <td className="py-2.5 px-3 font-data">{record.absences} d</td>
                <td className="py-2.5 px-3 font-data">{record.failures}</td>
                <td className="py-2.5 px-3 font-data text-[#74766F]">{record.G1}</td>
                <td className="py-2.5 px-3 font-data text-[#74766F]">{record.G2}</td>
                <td className={`py-2.5 px-3 font-data font-bold ${record.G3 >= 10 ? 'text-[#173B32]' : 'text-[#D95D24]'}`}>
                  {record.G3}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74766F] px-1">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-white border border-[#E8E4DB] rounded px-2 py-0.5 text-xs text-[#26342E]"
          >
            {[10, 25, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="flex space-x-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 bg-white border border-[#E8E4DB] rounded disabled:opacity-40 hover:bg-[#FAF7F0]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1 bg-white border border-[#E8E4DB] rounded disabled:opacity-40 hover:bg-[#FAF7F0]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
