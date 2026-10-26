# Student Intelligence — Research & Analytics Studio

An empirical research and academic analytics platform designed for secondary student performance analysis, built on the authentic UCI Machine Learning Secondary Student Performance dataset (*Cortez & Silva, 2008*).

---

## ◈ Product Philosophy: Descriptive Rigor over Fabricated Prediction

Unlike generic dashboards or superficial marks-prediction demos with inflated accuracy figures, **Student Intelligence Studio** is engineered as a scientific research environment. 

### Why Descriptive & Exploratory Analysis?
In this dataset, intermediate trimester marks ($G1$ and $G2$) correlate with the final mark ($G3$) at $r > 0.85$–$0.90$. Trivial machine-learning models predicting $G3$ from $G2$ merely demonstrate data leakage rather than pedagogical foresight. This studio instead prioritizes:
1. **Understanding Underlying Cohort Patterns**: Longitudinal assessment transitions ($G1 \to G2 \to G3$), score dispersions, and distribution shapes.
2. **Attendance & Engagement Dynamics**: Examining school truancy penalties, study hours allocation, and previous failure inertia.
3. **Addressing Confounding by Indication**: Revealing why compensatory school support (`schoolsup`) correlates negatively with grades without implying causation.
4. **Transparent Anomaly Audits**: Scientifically investigating the 38 Math and 15 Portuguese students who scored $G3 = 0$ (exam absence/withdrawal) without distorting the sample.
5. **Cross-Disciplinary Cohort Contrast**: Accounting for the **382 students enrolled concurrently** in both Mathematics and Portuguese language courses.

---

## ◈ Technology Stack & Architecture

- **Frontend Core**: React 19, TypeScript (Strict Mode), Vite 8
- **Styling & Design System**: Tailwind CSS v4, PostCSS, Custom Tokens (Editorial warm ivory, deep forest green, muted terracotta, sage, warm gold, charcoal)
- **Visualizations**: Recharts (native responsive SVG charts), custom geometric mathematical SVG motifs
- **Typography**: Playfair Display (editorial serif display), DM Sans (modern sans), JetBrains Mono (data/code)
- **Icons**: Lucide React
- **Analytical Engine**: Fully client-side statistical engine computing means, medians, variances, standard deviations, Tukey quartiles and outlier fences, Welch's t-tests, Cohen's d effect sizes, Pearson product-moment correlations, Spearman rank-order correlations, and linear regressions with zero server-roundtrip latency.
- **Data Ingestion**: Pre-indexed authentic UCI records (395 Math, 649 Portuguese, 1,044 enrollments) + PapaParse engine supporting user CSV uploads.

---

## ◈ Visual Identity & Palette

- **Warm Ivory**: `#F7F5EF` — Primary background and paper surfaces
- **Deep Forest Green**: `#17382B` — Primary brand identity, headers, Portuguese cohort accent
- **Muted Terracotta**: `#C55A38` — Mathematics cohort accent, warnings, key metric highlights
- **Sage**: `#8FA58A` — Secondary categorical indicators, subtle accents
- **Warm Gold**: `#D9A441` — Insignia, highlights, central tendency markers
- **Charcoal**: `#1C2923` — High-contrast typography and focus states

---

## ◈ Analytical Studio Modules

### 1. Research Landing / Overview (`LandingView.tsx`)
- Editorial headline, animated coordinate and bell-curve SVG visual.
- Cohort selectors (Combined 1,044 | Mathematics 395 | Portuguese 649).
- Dynamic aggregate statistics derived from active filters.
- Direct discipline contrast strip.

### 2. Executive Analytics (`ExecutiveAnalyticsView.tsx`)
- High-level KPIs: Active Cohort, Mean G3, Median, Standard Deviation, Statutory Pass Rate ($\ge 10/20$).
- Trimester Trajectory line chart tracking average mark progression across $G1$, $G2$, and $G3$.
- Portuguese statutory grade bands breakdown (Fail $0$–$9$, *Suficiente* $10$–$13$, *Bom* $14$–$15$, *Notável* $16$–$17$, *Excelente* $18$–$20$).

### 3. Academic Performance Lab (`PerformanceLabView.tsx`)
- Interactive integer frequency histogram ($0$ to $20$ scale) with density calculations.
- Box-and-whisker quartile breakdown: Min, $Q_1$, Median, $Q_3$, Max, IQR, and Tukey fences.
- Zero-grade anomaly inspector evaluating students receiving $G3 = 0$.

### 4. Engagement & Learning Patterns (`EngagementPatternsView.tsx`)
- Weekly study time categories ($<2$h, $2$–$5$h, $5$–$10$h, $>10$h) vs. achievement.
- Attendance scatter plot with ordinary least squares (OLS) linear trendline and $R^2$.
- Previous class failures ($0$ to $3+$) inertia breakdown.
- Institutional support paradox: Confounding analysis of `schoolsup`.

### 5. Relationship Explorer (`RelationshipExplorerView.tsx`)
- Dynamic correlation heatmap supporting both **Pearson $r$** (linear) and **Spearman $\rho$** (rank-order) coefficients.
- Bivariate pair selector with scatter plot, regression equation ($y = \beta x + \alpha$), and coefficient of determination ($R^2$).
- Progressive categorization: Academic, Study Habits, and Social/Domestic variables.

### 6. Cohort Comparison Studio (`CohortComparisonView.tsx`)
- Head-to-head contrast across subjects (Math vs. Por), schools (GP vs. MS), sex (F vs. M), address (Urban vs. Rural), and higher education ambition.
- Inferential testing: **Welch’s t-test**, degrees of freedom, and **Cohen’s d effect size** with 95% confidence intervals.
- Methodological documentation on the 382 student overlap.

### 7. Student Record Explorer (`StudentRecordExplorerView.tsx`)
- Searchable and multi-attribute filterable table.
- Column sorting across all dimensions and configurable pagination (10, 25, 50, 100).
- Detailed Student Profile Modal inspecting an individual student's complete academic and family background without fabricated personal identifiers.
- Filtered CSV download button.

### 8. Data Quality & Schema Audit (`DataQualityView.tsx`)
- 33-attribute dictionary registering data types, observed ranges, and unique values.
- Audit confirmation: 0 missing values (100% completeness) and 0 duplicate records.
- Clear distinction between raw data, standardized fields, and derived statistics.

### 9. Methodology & Viva Defense Guide (`MethodologyView.tsx`)
- Complete historical provenance: Cortez & Silva (2008), EUROSIS-ETI / UCI Repository #320.
- Statutory Portuguese grading system documentation.
- Viva preparation guide addressing common evaluator questions (why descriptive analytics is superior, how the 382 overlap is handled, why support correlates negatively).

---

## ◈ How to Run Locally

### Option 1: Fast Launch (Windows)
Double-click `run_studio.bat` or run:
```bash
.\run_studio.bat
```

### Option 2: Command Line (Node.js)
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Option 3: Python Streamlit Fallback (Legacy)
The original Streamlit application remains fully preserved:
```bash
py -m pip install -r requirements.txt
py -m streamlit run app.py
```

---

## ◈ Production Build & Verification

To verify TypeScript types and compile the optimized production bundle:
```bash
npm run build
```
This produces an optimized standalone build in `dist/` ready for zero-config static hosting.

---

## ◈ Vercel Deployment Guide

The frontend is 100% client-side and self-contained, meaning **it requires no persistent Python server** and deploys to Vercel with zero configuration:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete student intelligence and research platform"
   git push origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New Project** and select your GitHub repository.
   - Framework Preset: **Vite** (automatically detected).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./`
3. **Deploy**:
   - Click **Deploy**. Vercel will build and assign a global, high-performance HTTPS URL.
   - `vercel.json` is included to handle clean URLs and SPA routing.

---

## ◈ Dataset Attribution & References

- **UCI Machine Learning Repository**: Student Performance Dataset (ID #320)  
  URL: https://archive.ics.uci.edu/dataset/320/student+performance
- **Original Research**:  
  Cortez, P., & Silva, A. (2008). *Using data mining to predict secondary school student performance*. In Proceedings of 5th FUture BUsiness TEChnology Conference (FUBUTEC 2008), pp. 5–12, Porto, Portugal. EUROSIS-ETI, ISBN 978-9077381-39-7.
