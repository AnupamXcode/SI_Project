import React from 'react';
import { ExternalLink, Database, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#E6E3D8] bg-[#F1EDE2] text-[#4A5851] text-xs">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-serif-editorial text-base font-bold text-[#17382B]">
                Student Intelligence — Research & Analytics Studio
              </span>
            </div>
            <p className="text-[#68736B] leading-relaxed max-w-xl text-xs mb-4">
              An empirical research and academic analytics platform designed for the comprehensive study of secondary student performance factors. Built strictly on observational data from the UCI Machine Learning repository, prioritizing descriptive integrity, exploratory rigor, and statistical honesty over speculative automated grading.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono-data text-[#17382B]">
              <span className="inline-flex items-center space-x-1 bg-[#E4DFC8]/70 px-2.5 py-1 rounded-md border border-[#D5CFB5]">
                <Database className="w-3 h-3 text-[#17382B]" />
                <span>UCI ML Repository (#320)</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-[#E4DFC8]/70 px-2.5 py-1 rounded-md border border-[#D5CFB5]">
                <ShieldCheck className="w-3 h-3 text-[#C55A38]" />
                <span>Descriptive Rigor · No Fabricated Predictions</span>
              </span>
              <span className="inline-flex items-center space-x-1 bg-[#E4DFC8]/70 px-2.5 py-1 rounded-md border border-[#D5CFB5]">
                <Cpu className="w-3 h-3 text-[#17382B]" />
                <span>Client-Side Analytical Engine</span>
              </span>
            </div>
          </div>

          {/* Primary Reference Citation */}
          <div>
            <h4 className="font-serif-editorial text-sm font-semibold text-[#17382B] mb-2.5">
              Primary Reference
            </h4>
            <p className="text-[11px] text-[#68736B] leading-relaxed mb-3">
              Cortez, P., & Silva, A. (2008). <em>Using data mining to predict secondary school student performance</em>. In Proceedings of 5th FUture BUsiness TEChnology Conference (FUBUTEC 2008), pp. 5-12, Porto, Portugal.
            </p>
            <a
              href="https://archive.ics.uci.edu/dataset/320/student+performance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-[#C55A38] hover:text-[#9F4327] font-medium"
            >
              <span>View UCI Repository Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Methodology & Ethics */}
          <div>
            <h4 className="font-serif-editorial text-sm font-semibold text-[#17382B] mb-2.5">
              Methodological Standards
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[#68736B]">
              <li>• Observed sample: 395 Math, 649 Portuguese records</li>
              <li>• 382 students identified in both courses</li>
              <li>• Grading scale: 0 to 20 Portuguese standard scale</li>
              <li>• Transparent zero-grade anomaly handling</li>
              <li>• Zero-leakage client-side statistical pipeline</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#DFD9C9] flex flex-col sm:flex-row items-center justify-between text-[#78857C] text-[11px]">
          <p>© {new Date().getFullYear()} Student Intelligence & Research Platform. Academic Research Edition.</p>
          <p className="mt-2 sm:mt-0 font-mono-data">
            Palette: Warm Ivory · Forest Green · Terracotta · Sage · Warm Gold
          </p>
        </div>
      </div>
    </footer>
  );
};
