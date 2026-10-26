import React from 'react';
import { EditorialHeader } from '../components/common/EditorialHeader';
import { BookOpen, ExternalLink, ShieldCheck, GraduationCap, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-8">
      <EditorialHeader
        kicker="Methodology & Viva Defense"
        title="Research Documentation & Academic Defense Guide"
        description="Dataset provenance, Portuguese grading scale taxonomy, mathematical formulations, and viva defense rationale."
        tags={[
          { label: 'Cortez & Silva (2008)', color: 'green' },
          { label: 'Viva Preparation', color: 'gold' },
          { label: 'UCI Repository #320', color: 'terracotta' }
        ]}
      />

      {/* Primary Research Provenance */}
      <section className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
          Academic Origin
        </span>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-3">
          Dataset Provenance & Field Collection Context
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6861] leading-relaxed mb-4">
          The dataset was originally curated by Paulo Cortez and Alice Silva from the University of Minho, Portugal, and donated to the UCI Machine Learning Repository in 2014. The data was gathered during the 2005–2006 academic school year from two secondary educational institutions located in the Alentejo region of Portugal:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="font-bold text-[#17382B] block mb-1">
              Gabriel Pereira Secondary School (GP)
            </span>
            <p className="text-[#68736B]">
              Located in the historic urban municipality of Évora, Portugal. Represents a larger urban secondary cohort with varied socioeconomic backgrounds.
            </p>
          </div>
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5]">
            <span className="font-bold text-[#17382B] block mb-1">
              Mousinho da Silveira Secondary School (MS)
            </span>
            <p className="text-[#68736B]">
              Situated in Portalegre, Portugal. Represents a smaller regional secondary school setting with distinct rural and peri-urban student demographics.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#F8F5EC] rounded-xl border border-[#E4DEC9] flex items-center justify-between text-xs text-[#5A6861]">
          <div>
            <strong>Official Citation:</strong> Cortez, P., & Silva, A. (2008). <em>Using Data Mining to Predict Secondary School Student Performance</em>. In Proceedings of 5th FUture BUsiness TEChnology Conference (FUBUTEC 2008), pp. 5–12.
          </div>
          <a
            href="https://archive.ics.uci.edu/dataset/320/student+performance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#C55A38] font-bold shrink-0 ml-4 hover:underline"
          >
            <span>UCI Archive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Portuguese Grading Scale */}
      <section className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#17382B]">
          Educational Framework
        </span>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-3">
          The Portuguese 0–20 Grading Scale
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6861] leading-relaxed mb-6">
          Secondary education in Portugal utilizes an integer scale ranging strictly from 0 to 20, where 10 marks the statutory threshold for course passage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E9C8BC]">
            <span className="text-[10px] font-bold text-[#C55A38] uppercase block">Grade 0 – 9</span>
            <span className="font-serif-editorial text-lg font-bold text-[#C55A38] block my-1">Reprovado / Fail</span>
            <span className="text-[10px] text-[#7A8880]">Below passing standard</span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E4DEC9]">
            <span className="text-[10px] font-bold text-[#D9A441] uppercase block">Grade 10 – 13</span>
            <span className="font-serif-editorial text-lg font-bold text-[#17382B] block my-1">Suficiente</span>
            <span className="text-[10px] text-[#7A8880]">Satisfactory pass</span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E4DEC9]">
            <span className="text-[10px] font-bold text-[#8FA58A] uppercase block">Grade 14 – 15</span>
            <span className="font-serif-editorial text-lg font-bold text-[#17382B] block my-1">Bom</span>
            <span className="text-[10px] text-[#7A8880]">Good achievement</span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#E4DEC9]">
            <span className="text-[10px] font-bold text-[#17382B] uppercase block">Grade 16 – 17</span>
            <span className="font-serif-editorial text-lg font-bold text-[#17382B] block my-1">Notável</span>
            <span className="text-[10px] text-[#7A8880]">Very Good with distinction</span>
          </div>

          <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#C6D6C4]">
            <span className="text-[10px] font-bold text-[#17382B] uppercase block">Grade 18 – 20</span>
            <span className="font-serif-editorial text-lg font-bold text-[#17382B] block my-1">Excelente</span>
            <span className="text-[10px] text-[#7A8880]">Exceptional mastery</span>
          </div>
        </div>
      </section>

      {/* Viva Defense Guide & Common Evaluator Questions */}
      <section className="bg-paper-card rounded-2xl p-6 sm:p-8 border border-[#E0DBCB] shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C55A38]">
          University Viva & Evaluation Preparation
        </span>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#17382B] mb-2">
          Key Questions & Research Defense Rationale
        </h3>
        <p className="text-xs sm:text-sm text-[#5A6861] leading-relaxed mb-6">
          Be fully prepared to address technical questions from professors and technical reviewers regarding analytical choices:
        </p>

        <div className="space-y-4 text-xs text-[#5A6861]">
          {/* Question 1 */}
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5] space-y-2">
            <h4 className="font-bold text-[#17382B] text-sm flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#17382B] text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Why did you build an exploratory research platform instead of a marks-prediction ML model?</span>
            </h4>
            <p className="leading-relaxed pl-7">
              <strong>Answer:</strong> Predictive marks models on this dataset suffer from extreme data leakage: G1 and G2 correlate with G3 at r &gt; 0.85–0.90. Predicting G3 from G2 is trivial and lacks genuine pedagogical utility. Real-world institutional decision-making requires understanding underlying cohort patterns, socio-behavioral associations, and truant risk factors rather than black-box point estimates with fabricated high accuracies.
            </p>
          </div>

          {/* Question 2 */}
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5] space-y-2">
            <h4 className="font-bold text-[#17382B] text-sm flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#17382B] text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>How are the 382 overlapping students between Mathematics and Portuguese handled?</span>
            </h4>
            <p className="leading-relaxed pl-7">
              <strong>Answer:</strong> We explicitly document that 382 students belong to both datasets (identified by 13 matching demographic attributes including school, sex, age, address, and family variables). We treat the combined view as an enrollment-level dataset (1,044 enrollments) and warn users in the Cohort Studio that Math and Portuguese are not mutually independent samples.
            </p>
          </div>

          {/* Question 3 */}
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5] space-y-2">
            <h4 className="font-bold text-[#17382B] text-sm flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#17382B] text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Why do students receiving extra educational support (`schoolsup = yes`) have lower average marks?</span>
            </h4>
            <p className="leading-relaxed pl-7">
              <strong>Answer:</strong> This is a classic confounding by indication / selection effect in observational data. Remedial educational support is assigned to students who were already struggling academically. Without adjusting for baseline capability, raw correlation shows a negative association which must not be confused with causal degradation.
            </p>
          </div>

          {/* Question 4 */}
          <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#EAE4D5] space-y-2">
            <h4 className="font-bold text-[#17382B] text-sm flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#17382B] text-white text-[11px] flex items-center justify-center font-bold">4</span>
              <span>How do you handle the cluster of zero marks (G3 = 0)?</span>
            </h4>
            <p className="leading-relaxed pl-7">
              <strong>Answer:</strong> There are 38 students in Mathematics and 15 in Portuguese who received G3 = 0. We inspect them in the Performance Lab. Rather than inventing drop-out labels or discarding them, we document that these students completed earlier trimesters with positive marks but missed final evaluation sessions. Discarding them would bias the sample, while analyzing them provides transparency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
