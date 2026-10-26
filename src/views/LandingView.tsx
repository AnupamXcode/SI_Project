import React from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, 
  BarChart3, 
  GitCompare, 
  Activity, 
  Compass, 
  Database, 
  Layers, 
  BookOpen, 
  CheckCircle2,
  Table
} from 'lucide-react';
import { StatMetricCard } from '../components/common/StatMetricCard';
import { DATASET_METADATA } from '../data/rawStudents';

export const LandingView: React.FC = () => {
  const { setActiveTab, filters, setFilters, currentStats, mathStats, porStats, filteredRecords } = useData();

  return (
    <div className="space-y-12">
      {/* Editorial Hero Stage */}
      <section className="relative overflow-hidden rounded-3xl bg-forest-gradient text-[#FFFDF7] p-8 sm:p-12 lg:p-16 border border-[#17382B] shadow-xl">
        {/* Abstract Coordinate Geometry Motif in Background */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-20 flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-full h-full max-w-[500px]">
            <defs>
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D9A441" />
                <stop offset="50%" stopColor="#8FA58A" />
                <stop offset="100%" stopColor="#C55A38" />
              </linearGradient>
            </defs>
            {/* Coordinate Grid */}
            <line x1="50" y1="400" x2="450" y2="400" stroke="#FFFDF7" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50" y1="50" x2="50" y2="400" stroke="#FFFDF7" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="250" y1="50" x2="250" y2="400" stroke="#FFFDF7" strokeWidth="1" strokeDasharray="2 4" />
            
            {/* Bell Curve / Normal Distribution SVG */}
            <path
              d="M 50 400 Q 150 395 200 300 Q 250 80 250 80 Q 250 80 300 300 Q 350 395 450 400"
              fill="none"
              stroke="url(#curveGrad)"
              strokeWidth="3.5"
            />
            {/* Secondary Shifted Distribution */}
            <path
              d="M 50 400 Q 180 390 230 250 Q 280 120 280 120 Q 280 120 330 260 Q 380 390 450 400"
              fill="none"
              stroke="#FFFDF7"
              strokeWidth="2"
              opacity="0.6"
              strokeDasharray="6 6"
            />
            {/* Markers */}
            <circle cx="250" cy="80" r="5" fill="#D9A441" />
            <circle cx="280" cy="120" r="5" fill="#C55A38" />
            <text x="255" y="75" fill="#D9A441" fontSize="12" fontFamily="monospace">μ=10.42 (Math)</text>
            <text x="285" y="115" fill="#FFFDF7" fontSize="12" fontFamily="monospace">μ=11.91 (Por)</text>
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-mono-data border border-white/15 mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse" />
            <span>EMPIRICAL RESEARCH STUDIO · UCI BENCHMARK REPOSITORY</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
            Secondary Student <br className="hidden sm:inline" />
            <span className="italic text-[#EAE4D2]">Performance Dynamics</span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0DACB] leading-relaxed mb-8 max-w-2xl font-normal">
            A rigorous scientific exploration of secondary school outcomes across Mathematics and Portuguese language cohorts. Investigate grade distributions, attendance patterns, and socioeconomic associations without fabricated machine-learning predictions.
          </p>

          {/* Cohort Selector Pills inside Hero */}
          <div className="bg-[#10271E]/70 p-1.5 rounded-2xl border border-white/15 inline-flex flex-wrap gap-1.5 mb-8 backdrop-blur-sm">
            <button
              onClick={() => setFilters(prev => ({ ...prev, subject: 'all' }))}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.subject === 'all'
                  ? 'bg-[#F7F5EF] text-[#17382B] shadow-md font-bold'
                  : 'text-[#D0DACB] hover:text-white'
              }`}
            >
              Combined Cohort ({DATASET_METADATA.totalEnrollments})
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, subject: 'Mathematics' }))}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.subject === 'Mathematics'
                  ? 'bg-[#C55A38] text-white shadow-md font-bold'
                  : 'text-[#D0DACB] hover:text-[#C55A38]'
              }`}
            >
              Mathematics Cohort ({DATASET_METADATA.mathCount})
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, subject: 'Portuguese' }))}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.subject === 'Portuguese'
                  ? 'bg-[#8FA58A] text-[#17382B] shadow-md font-bold'
                  : 'text-[#D0DACB] hover:text-[#8FA58A]'
              }`}
            >
              Portuguese Language ({DATASET_METADATA.porCount})
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('executive')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#D9A441] hover:bg-[#C99431] text-[#17382B] font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              <span>Enter Executive Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold transition-all backdrop-blur-xs"
            >
              <BarChart3 className="w-4 h-4 text-[#8FA58A]" />
              <span>Explore Grade Distributions</span>
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl text-xs text-[#D0DACB] hover:text-white font-medium transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#D9A441]" />
              <span>Read Methodology</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dataset Provenance & Key Indicators */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C55A38]">
              Empirical Foundations
            </span>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
              Selected Cohort Overview
            </h2>
          </div>
          <span className="text-xs text-[#68736B] font-mono-data">
            Active view: <strong>{filteredRecords.length}</strong> records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMetricCard
            label="Enrolled Records in View"
            value={currentStats.count.toLocaleString()}
            subtext={
              filters.subject === 'all'
                ? 'Includes 395 Math & 649 Portuguese course enrollments'
                : `Filtered strictly to ${filters.subject} records`
            }
            badge={filters.subject === 'all' ? 'Combined' : filters.subject}
            badgeColor={filters.subject === 'Mathematics' ? 'terracotta' : 'green'}
          />

          <StatMetricCard
            label="Mean Final Grade (G3)"
            value={`${currentStats.mean} / 20`}
            subtext={`Median: ${currentStats.median} · Standard Dev: ${currentStats.std}`}
            badge="Scale: 0–20"
            badgeColor="gold"
          />

          <StatMetricCard
            label="Threshold ≥ 10 Rate"
            value={`${currentStats.passRate}%`}
            subtext="Exploratory passing threshold (10/20 in Portuguese national grading)"
            badge="Pass Criterion"
            badgeColor="sage"
          />

          <StatMetricCard
            label="Zero-Grade Incidence"
            value={`${currentStats.zeroRate}%`}
            subtext="Records recorded with G3 = 0 (exam non-attendance or early course withdrawal)"
            badge="Data Integrity"
            badgeColor="charcoal"
          />
        </div>
      </section>

      {/* Cohort Comparison Strip */}
      <section className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E4DEC9] shadow-xs">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#17382B]">
            Direct Discipline Contrast
          </span>
          <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mt-1 mb-2">
            Mathematics vs. Portuguese Language Outcomes
          </h3>
          <p className="text-xs sm:text-sm text-[#68736B] leading-relaxed">
            The UCI dataset comprises two core subject domains evaluated within the same academic calendar in Portugal. Mathematics yields significantly higher grade dispersion and zero-grade occurrences than Portuguese language courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mathematics Panel */}
          <div className="rounded-xl p-5 border border-[#E9C4B7] bg-[#FCF8F6]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif-editorial text-lg font-bold text-[#C55A38]">
                Mathematics Cohort
              </span>
              <span className="text-xs font-mono-data px-2 py-0.5 rounded bg-[#C55A38]/15 text-[#C55A38] font-bold">
                n = {DATASET_METADATA.mathCount}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Mean Grade</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">{mathStats.mean}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Std Dev</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">{mathStats.std}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#EFE1DB]">
                <span className="text-[10px] text-[#7A8880] block">Pass (≥10)</span>
                <span className="font-serif-editorial text-xl font-bold text-[#C55A38]">{mathStats.passRate}%</span>
              </div>
            </div>
            <p className="text-xs text-[#7A8880] leading-relaxed">
              Demonstrates wider variance (σ=4.58) with 38 zero-grades (9.6% non-completion/zero mark).
            </p>
          </div>

          {/* Portuguese Panel */}
          <div className="rounded-xl p-5 border border-[#C6D6C4] bg-[#F4F8F4]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif-editorial text-lg font-bold text-[#17382B]">
                Portuguese Language Cohort
              </span>
              <span className="text-xs font-mono-data px-2 py-0.5 rounded bg-[#17382B]/15 text-[#17382B] font-bold">
                n = {DATASET_METADATA.porCount}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-white p-2.5 rounded-lg border border-[#D5E3D3]">
                <span className="text-[10px] text-[#7A8880] block">Mean Grade</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">{porStats.mean}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D5E3D3]">
                <span className="text-[10px] text-[#7A8880] block">Std Dev</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">{porStats.std}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D5E3D3]">
                <span className="text-[10px] text-[#7A8880] block">Pass (≥10)</span>
                <span className="font-serif-editorial text-xl font-bold text-[#17382B]">{porStats.passRate}%</span>
              </div>
            </div>
            <p className="text-xs text-[#7A8880] leading-relaxed">
              Exhibits tighter clustering around the mean (σ=3.23) and higher overall pass rate (84.6%).
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#EBE5D6] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#7A8880] gap-2">
          <span>
            <strong>Statistical Note:</strong> An estimated 382 students are enrolled concurrently in both Math and Portuguese courses.
          </span>
          <button
            onClick={() => setActiveTab('cohorts')}
            className="inline-flex items-center space-x-1 text-[#C55A38] hover:text-[#9F4327] font-semibold"
          >
            <span>Open Cohort Comparison Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Navigation Gateway / Studio Areas */}
      <section>
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C55A38]">
            Analytical Architecture
          </span>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#17382B]">
            Specialized Analytical Studios
          </h2>
          <p className="text-xs sm:text-sm text-[#68736B] mt-1">
            Seamlessly navigate between targeted research perspectives:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => setActiveTab('executive')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#17382B]/10 flex items-center justify-center text-[#17382B] mb-4 group-hover:bg-[#17382B] group-hover:text-white transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Executive Analytics
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              High-level cohort KPIs, grade dispersion, period-over-period transitions (G1 to G2 to G3), and Portuguese grading band distributions.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#17382B] group-hover:translate-x-1 transition-transform">
              <span>View Executive Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('performance')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C55A38]/10 flex items-center justify-center text-[#C55A38] mb-4 group-hover:bg-[#C55A38] group-hover:text-white transition-all">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Performance & Outlier Lab
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              Interactive histograms with custom binning, box-and-whisker quartile spreads, Tukey outlier fences, and zero-mark anomaly inspection.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#C55A38] group-hover:translate-x-1 transition-transform">
              <span>Open Performance Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('relationships')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8FA58A]/20 flex items-center justify-center text-[#17382B] mb-4 group-hover:bg-[#8FA58A] group-hover:text-[#17382B] transition-all">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Relationship Explorer
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              Bivariate correlation heatmap (Pearson r and Spearman rank ρ), selectable scatter plots with linear trendlines, and confounding caveats.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#17382B] group-hover:translate-x-1 transition-transform">
              <span>Explore Correlations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('engagement')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 flex items-center justify-center text-[#916719] mb-4 group-hover:bg-[#D9A441] group-hover:text-[#17382B] transition-all">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Engagement Patterns
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              Investigate weekly study time, school absences, previous class failures, and extra institutional vs family support associations.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#17382B] group-hover:translate-x-1 transition-transform">
              <span>Analyze Habits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('explorer')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#17382B]/10 flex items-center justify-center text-[#17382B] mb-4 group-hover:bg-[#17382B] group-hover:text-white transition-all">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Records Explorer
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              Multi-attribute search, numeric sliders, pagination, individual student profile inspections, and clean filtered CSV downloads.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#17382B] group-hover:translate-x-1 transition-transform">
              <span>Inspect All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('methodology')}
            className="group cursor-pointer bg-paper-card hover:bg-[#FFFEFA] p-6 rounded-2xl border border-[#E0DBCB] hover:border-[#17382B] transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8FA58A]/20 flex items-center justify-center text-[#17382B] mb-4 group-hover:bg-[#8FA58A] group-hover:text-[#17382B] transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#17382B] mb-2 group-hover:text-[#C55A38] transition-colors">
              Methodology & Viva Notes
            </h3>
            <p className="text-xs text-[#68736B] leading-relaxed mb-4">
              Full attribute codebook, European grading systems, statistical formulas, research assumptions, and viva defense preparation guidelines.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#17382B] group-hover:translate-x-1 transition-transform">
              <span>Read Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
