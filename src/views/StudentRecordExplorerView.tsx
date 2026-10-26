import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { StudentRecord } from '../types/student';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const StudentRecordExplorerView: React.FC = () => {
  const { 
    filteredRecords, 
    allRecords, 
    filters, 
    setFilters, 
    resetFilters, 
    exportFilteredCSV, 
    setSelectedStudentRecord 
  } = useData();

  const [sortColumn, setSortColumn] = useState<keyof StudentRecord>('G3');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredRecords, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (column: keyof StudentRecord) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      <EditorialHeader
        kicker="Record Explorer"
        title="Student Observational Database"
        description="Filter, sort, and inspect real individual secondary student records with multi-attribute criteria and anonymized provenance."
        tags={[
          { label: `Matching Records: ${filteredRecords.length}`, color: 'green' },
          { label: `Total Enrolled: ${allRecords.length}`, color: 'gold' }
        ]}
      >
        <button
          onClick={exportFilteredCSV}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#17382B] hover:bg-[#234D3C] text-white text-xs font-semibold transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#D9A441]" />
          <span>Export Filtered CSV ({filteredRecords.length})</span>
        </button>
      </EditorialHeader>

      {/* Search & Quick Controls Bar */}
      <div className="bg-paper-card rounded-2xl p-4 sm:p-5 border border-[#E0DBCB] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8FA58A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, guardian, school, jobs..."
            value={filters.searchQuery}
            onChange={e => {
              setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border border-[#D5CFBF] rounded-xl text-xs text-[#17382B] focus:outline-hidden focus:border-[#17382B]"
          />
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-xs text-[#68736B]">
            Showing <strong className="text-[#17382B]">{paginatedRecords.length}</strong> of{' '}
            <strong className="text-[#17382B]">{filteredRecords.length}</strong> records
          </div>

          <button
            onClick={() => {
              resetFilters();
              setCurrentPage(1);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#D8D2C2] bg-white hover:bg-[#F5F2E9] text-xs font-medium text-[#C55A38] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-paper-card rounded-2xl border border-[#E0DBCB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF7EE] border-b border-[#E0DACB] text-[#17382B]">
                <th className="p-3 font-semibold">Action</th>
                <th 
                  onClick={() => handleSort('id')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('subject')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Subject</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('school')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>School</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sex')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Sex / Age</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('studytime')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Study Hours</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('absences')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Absences</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('failures')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Failures</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('G1')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>G1</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('G2')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>G2</span>
                    <ArrowUpDown className="w-3 h-3 text-[#8FA58A]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('G3')}
                  className="p-3 font-semibold cursor-pointer hover:bg-[#EAE4D5] transition-colors bg-[#17382B]/5"
                >
                  <div className="flex items-center space-x-1 text-[#17382B] font-bold">
                    <span>Final G3</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#C55A38]" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D5]">
              {paginatedRecords.map(record => (
                <tr 
                  key={record.id} 
                  className="hover:bg-[#FAF7F0] transition-colors text-[#4A5851]"
                >
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedStudentRecord(record)}
                      className="p-1.5 rounded-md hover:bg-[#EAE4D5] text-[#17382B] transition-colors"
                      title="Inspect complete student profile"
                    >
                      <Eye className="w-4 h-4 text-[#C55A38]" />
                    </button>
                  </td>
                  <td className="p-3 font-mono-data font-medium text-[#17382B]">
                    {record.id}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      record.subject === 'Mathematics' 
                        ? 'bg-[#C55A38]/15 text-[#C55A38]' 
                        : 'bg-[#17382B]/15 text-[#17382B]'
                    }`}>
                      {record.subject}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#17382B]">
                    {record.school}
                  </td>
                  <td className="p-3">
                    {record.sex} · Age {record.age}
                  </td>
                  <td className="p-3">
                    {record.studytime === 1 ? '<2 hrs' : record.studytime === 2 ? '2–5 hrs' : record.studytime === 3 ? '5–10 hrs' : '>10 hrs'}
                  </td>
                  <td className="p-3 font-mono-data font-semibold text-[#C55A38]">
                    {record.absences} d
                  </td>
                  <td className="p-3 font-mono-data">
                    {record.failures}
                  </td>
                  <td className="p-3 font-mono-data text-[#68736B]">
                    {record.G1}
                  </td>
                  <td className="p-3 font-mono-data text-[#68736B]">
                    {record.G2}
                  </td>
                  <td className={`p-3 font-mono-data font-bold text-sm ${
                    record.G3 >= 10 ? 'text-[#17382B]' : 'text-[#C55A38]'
                  }`}>
                    {record.G3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#FAF7EE] border-t border-[#E0DACB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#68736B]">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[#D5CFBF] rounded px-2 py-1 text-xs text-[#17382B]"
            >
              {[10, 25, 50, 100].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#68736B]">
              Page <strong className="text-[#17382B]">{currentPage}</strong> of{' '}
              <strong className="text-[#17382B]">{totalPages}</strong>
            </span>
            <div className="flex space-x-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#D8D2C2] bg-white disabled:opacity-40 hover:bg-[#F5F2E9] transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-[#17382B]" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#D8D2C2] bg-white disabled:opacity-40 hover:bg-[#F5F2E9] transition-all"
              >
                <ChevronRight className="w-4 h-4 text-[#17382B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
