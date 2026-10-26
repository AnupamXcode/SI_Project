import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E8E4DB] mt-20 py-10 bg-[#FAF8F3] text-xs text-[#77776F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="font-medium text-[#292D28]">Student Performance Analysis</p>
          <p className="text-[11px] mt-0.5">
            Based on the UCI Machine Learning Student Performance Dataset (Cortez & Silva, 2008).
          </p>
        </div>

        <div className="text-[11px] sm:text-right">
          <p>Gabriel Pereira & Mousinho da Silveira Secondary Schools (Portugal)</p>
          <a
            href="https://archive.ics.uci.edu/dataset/320/student+performance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#456B52] hover:underline"
          >
            UCI Dataset Repository #320
          </a>
        </div>
      </div>
    </footer>
  );
};
