import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E8E4DB] mt-20 py-10 bg-[#FAF7F0] text-xs text-[#74766F]">
      <div className="w-full px-[5%] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="font-medium text-[#26342E]">Student Performance Analysis</p>
          <p className="text-[11px] mt-0.5">
            Secondary education observational dataset (Cortez & Silva, 2008).
          </p>
        </div>

        <div className="text-[11px] sm:text-right">
          <p>Gabriel Pereira (Évora) & Mousinho da Silveira (Portalegre), Portugal</p>
          <a
            href="https://archive.ics.uci.edu/dataset/320/student+performance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D95D24] hover:underline"
          >
            UCI Machine Learning Repository #320
          </a>
        </div>
      </div>
    </footer>
  );
};
