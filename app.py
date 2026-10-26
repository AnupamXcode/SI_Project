import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

st.set_page_config(
    page_title="Student Performance | Insight Studio",
    page_icon="◈",
    layout="wide",
    initial_sidebar_state="expanded",
)

BG = "#F7F5EF"
INK = "#1C2923"
GREEN = "#17382B"
SAGE = "#8FA58A"
TERRA = "#C55A38"
GOLD = "#D9A441"
MUTED = "#68736B"

st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
:root {{ --bg:{BG}; --ink:{INK}; --green:{GREEN}; --sage:{SAGE}; --terra:{TERRA}; }}
html, body, [data-testid="stAppViewContainer"] {{ background:var(--bg); color:var(--ink); font-family:'DM Sans',sans-serif; }}
[data-testid="stHeader"] {{ background:rgba(247,245,239,.88); }}
[data-testid="stSidebar"] {{ background:#EAEDE5; border-right:1px solid #D8DED4; }}
[data-testid="stSidebar"] * {{ color:var(--ink); }}
.block-container {{ padding-top:1.6rem; padding-bottom:3rem; max-width:1500px; }}
h1,h2,h3 {{ color:var(--ink); }}
.hero {{ background:linear-gradient(125deg,#17382B 0%,#254D3B 62%,#49664D 100%); color:#F7F5EF; padding:2.2rem 2.4rem; border-radius:24px; position:relative; overflow:hidden; margin-bottom:1.25rem; }}
.hero:after {{ content:'◈'; position:absolute; right:4%; top:-42px; font-size:190px; color:rgba(255,255,255,.07); transform:rotate(12deg); }}
.eyebrow {{ text-transform:uppercase; letter-spacing:.19em; font-size:.72rem; font-weight:700; color:#D7DFD2; }}
.hero h1 {{ font-family:'Playfair Display',serif; font-size:clamp(2.1rem,4vw,3.6rem); line-height:1.08; color:#FFFDF7; margin:.45rem 0 .7rem; }}
.hero p {{ color:#E1E8DE; font-size:1rem; max-width:760px; margin:0; }}
.section-kicker {{ text-transform:uppercase; letter-spacing:.14em; font-size:.72rem; font-weight:700; color:#7D8B7C; margin:1.2rem 0 .25rem; }}
.section-title {{ font-family:'Playfair Display',serif; font-size:1.65rem; font-weight:600; margin:0 0 .85rem; color:var(--ink); }}
.metric-card {{ background:#FFFEFA; border:1px solid #E3E3D9; border-radius:18px; padding:1.05rem 1.15rem; min-height:118px; box-shadow:0 5px 18px rgba(28,41,35,.035); }}
.metric-label {{ font-size:.78rem; color:#68736B; font-weight:600; }}
.metric-value {{ font-family:'Playfair Display',serif; font-size:2rem; font-weight:600; line-height:1.3; color:#17382B; }}
.metric-note {{ font-size:.74rem; color:#8A938B; margin-top:.1rem; }}
.panel {{ background:#FFFEFA; border:1px solid #E3E3D9; border-radius:18px; padding:1rem 1.1rem; }}
div[data-testid="stTabs"] button {{ font-weight:600; }}
div[data-testid="stDownloadButton"] button, div[data-testid="stButton"] button {{ border-radius:10px; border:0; background:#17382B; color:#fffdf7; font-weight:600; }}
div[data-testid="stDownloadButton"] button:hover, div[data-testid="stButton"] button:hover {{ background:#C55A38; color:white; }}
.small-muted {{ color:#68736B; font-size:.86rem; }}
div[data-testid="stAlert"] {{ border-radius:12px; }}
footer {{ visibility:hidden; }}
</style>
""", unsafe_allow_html=True)

def find_default_file(filename):
    candidates = [
        Path("data") / filename,
        Path(filename),
        Path("/mount/src") / "data" / filename,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None

def load_csv(upload, default_name):
    if upload is not None:
        try:
            return pd.read_csv(upload, sep=None, engine="python")
        except Exception:
            upload.seek(0)
            return pd.read_csv(upload)
    p = find_default_file(default_name)
    if p:
        try:
            return pd.read_csv(p, sep=None, engine="python")
        except Exception:
            return pd.read_csv(p)
    return None

def standardize(df, subject):
    out = df.copy()
    out.columns = [str(c).strip() for c in out.columns]
    if "G3" not in out.columns:
        return None
    out["subject"] = subject
    for c in ["G1", "G2", "G3", "age", "studytime", "absences", "failures"]:
        if c in out.columns:
            out[c] = pd.to_numeric(out[c], errors="coerce")
    return out

def metric(label, value, note=""):
    st.markdown(
        f'<div class="metric-card"><div class="metric-label">{label}</div>'
        f'<div class="metric-value">{value}</div><div class="metric-note">{note}</div></div>',
        unsafe_allow_html=True
    )

st.sidebar.markdown("## ◈ Insight Studio")
st.sidebar.caption("STUDENT PERFORMANCE / ANALYTICS")
st.sidebar.markdown("---")
st.sidebar.markdown("### Load your data")
st.sidebar.caption("For a deployed app, either commit the two CSV files inside a `data/` folder or upload them here.")
math_upload = st.sidebar.file_uploader("Mathematics CSV (student-mat.csv)", type=["csv"], key="math")
port_upload = st.sidebar.file_uploader("Portuguese CSV (student-por.csv)", type=["csv"], key="port")

math_raw = load_csv(math_upload, "student-mat.csv")
port_raw = load_csv(port_upload, "student-por.csv")

frames = []
if math_raw is not None:
    m = standardize(math_raw, "Mathematics")
    if m is not None:
        frames.append(m)
if port_raw is not None:
    p = standardize(port_raw, "Portuguese")
    if p is not None:
        frames.append(p)

if not frames:
    st.markdown("""
    <div class="hero">
      <div class="eyebrow">Student research · Data stories</div>
      <h1>Student Performance<br>Insight Studio</h1>
      <p>A clean, interactive workspace for exploring grades, study habits, attendance patterns and student groups — without marks prediction.</p>
    </div>
    """, unsafe_allow_html=True)
    st.warning("Upload `student-mat.csv` and/or `student-por.csv` using the sidebar, or place them in the app's `data/` folder before deploying.")
    st.markdown("#### Expected dataset")
    st.write("This app is designed for the UCI Student Performance dataset. Each file should contain a numeric `G3` final-grade column. The original files use semicolon separators; this app detects them automatically.")
    st.stop()

df = pd.concat(frames, ignore_index=True, sort=False)
if "G3" not in df:
    st.error("The loaded data needs a `G3` final-grade column. Check that you uploaded the correct Student Performance CSV.")
    st.stop()

available_subjects = ["All subjects"] + sorted(df["subject"].dropna().unique().tolist())
subject_choice = st.sidebar.selectbox("Subject cohort", available_subjects)
min_grade, max_grade = int(np.nanmin(df["G3"])), int(np.nanmax(df["G3"]))
grade_range = st.sidebar.slider("Final grade range", min_value=min_grade, max_value=max_grade, value=(min_grade, max_grade))
if "studytime" in df.columns:
    study_vals = sorted(pd.to_numeric(df["studytime"], errors="coerce").dropna().unique().tolist())
    study_choice = st.sidebar.multiselect("Study-time category", study_vals, default=study_vals)
else:
    study_choice = None
if "school" in df.columns:
    school_vals = sorted(df["school"].dropna().astype(str).unique().tolist())
    school_choice = st.sidebar.multiselect("School", school_vals, default=school_vals)
else:
    school_choice = None

filtered = df.copy()
if subject_choice != "All subjects":
    filtered = filtered[filtered["subject"] == subject_choice]
filtered = filtered[filtered["G3"].between(grade_range[0], grade_range[1], inclusive="both")]
if study_choice is not None:
    filtered = filtered[pd.to_numeric(filtered["studytime"], errors="coerce").isin(study_choice)]
if school_choice is not None:
    filtered = filtered[filtered["school"].astype(str).isin(school_choice)]

st.markdown("""
<div class="hero">
  <div class="eyebrow">Student research · Data stories</div>
  <h1>Student Performance<br>Insight Studio</h1>
  <p>Explore academic outcomes, compare cohorts, and investigate the patterns behind student grades. Built for analysis, not prediction.</p>
</div>
""", unsafe_allow_html=True)

st.markdown('<div class="section-kicker">At a glance</div><div class="section-title">The cohort, in numbers</div>', unsafe_allow_html=True)
c1, c2, c3, c4 = st.columns(4)
with c1:
    metric("Students in view", f"{len(filtered):,}", "Records after active filters")
with c2:
    metric("Mean final grade", f"{filtered['G3'].mean():.2f}" if len(filtered) else "—", "Scale in source data: 0–20")
with c3:
    metric("Median final grade", f"{filtered['G3'].median():.2f}" if len(filtered) else "—", "Middle observed grade")
with c4:
    threshold = (filtered["G3"] >= 10).mean() * 100 if len(filtered) else np.nan
    metric("Grade ≥ 10", f"{threshold:.1f}%" if pd.notna(threshold) else "—", "Exploratory threshold, not universal policy")

if filtered.empty:
    st.info("No records match the selected filters. Widen the grade range or reset the sidebar filters.")
    st.stop()

tab_overview, tab_performance, tab_engagement, tab_relationships, tab_explorer = st.tabs([
    "01  Overview", "02  Grade patterns", "03  Engagement", "04  Relationships", "05  Data explorer"
])

palette = {"Mathematics": TERRA, "Portuguese": GREEN}
with tab_overview:
    left, right = st.columns([1.15, 0.85], gap="large")
    with left:
        st.markdown('<div class="section-title">Where do grades cluster?</div>', unsafe_allow_html=True)
        fig = px.histogram(filtered, x="G3", color="subject", barmode="overlay", opacity=.78,
                           nbins=21, color_discrete_map=palette,
                           labels={"G3":"Final grade (G3)", "subject":"Subject"})
        fig.update_layout(template="plotly_white", margin=dict(l=10,r=10,t=30,b=10),
                          legend_title_text="", paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
    with right:
        st.markdown('<div class="section-title">Subject snapshot</div>', unsafe_allow_html=True)
        subject_summary = filtered.groupby("subject", as_index=False).agg(
            Students=("G3","size"), Mean=("G3","mean"), Median=("G3","median"), Std=("G3","std")
        ).round(2)
        fig = px.bar(subject_summary, x="subject", y="Mean", color="subject",
                     text="Mean", color_discrete_map=palette,
                     labels={"subject":"Subject", "Mean":"Average final grade"},
                     range_y=[0, max(20, float(subject_summary["Mean"].max()+2))])
        fig.update_traces(texttemplate="%{text:.2f}", textposition="outside", cliponaxis=False)
        fig.update_layout(template="plotly_white", showlegend=False, margin=dict(l=10,r=10,t=20,b=10),
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
        st.dataframe(subject_summary, use_container_width=True, hide_index=True)
    st.markdown('<div class="section-title">Assessment journey</div>', unsafe_allow_html=True)
    periods = [c for c in ["G1","G2","G3"] if c in filtered.columns]
    if periods:
        trend = filtered.groupby("subject")[periods].mean().reset_index().melt(
            id_vars="subject", var_name="Assessment period", value_name="Average grade")
        fig = px.line(trend, x="Assessment period", y="Average grade", color="subject",
                      markers=True, color_discrete_map=palette)
        fig.update_layout(template="plotly_white", margin=dict(l=10,r=10,t=20,b=10),
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
    st.caption("G1, G2 and G3 represent period grades in this dataset. These charts describe observed records; they do not predict future outcomes.")

with tab_performance:
    l, r = st.columns(2, gap="large")
    with l:
        fig = px.box(filtered, x="subject", y="G3", color="subject", points="outliers",
                     color_discrete_map=palette, labels={"G3":"Final grade", "subject":"Subject"})
        fig.update_layout(template="plotly_white", showlegend=False, title="Spread and outliers",
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
    with r:
        if all(c in filtered.columns for c in ["G1","G2","G3"]):
            long = filtered.melt(id_vars="subject", value_vars=["G1","G2","G3"],
                                 var_name="Assessment period", value_name="Grade")
            fig = px.violin(long, x="Assessment period", y="Grade", color="subject", box=True,
                            points=False, color_discrete_map=palette)
            fig.update_layout(template="plotly_white", title="Grade distribution across periods",
                              paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("G1 and G2 are not present, so period comparisons are unavailable.")
    st.markdown('<div class="section-title">Descriptive statistics</div>', unsafe_allow_html=True)
    st.dataframe(filtered.groupby("subject")["G3"].describe().round(2), use_container_width=True)

with tab_engagement:
    left, right = st.columns(2, gap="large")
    with left:
        if "absences" in filtered.columns:
            fig = px.scatter(filtered, x="absences", y="G3", color="subject",
                             hover_data=[c for c in ["studytime","failures","age"] if c in filtered.columns],
                             opacity=.7, color_discrete_map=palette,
                             labels={"absences":"Absences", "G3":"Final grade"})
            fig.update_layout(template="plotly_white", title="Absences and final grades",
                              paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No absences column was found.")
    with right:
        if "studytime" in filtered.columns:
            study_labels = {1:"< 2 hours",2:"2–5 hours",3:"5–10 hours",4:"> 10 hours"}
            chart_df = filtered.copy()
            chart_df["Study time"] = pd.to_numeric(chart_df["studytime"], errors="coerce").map(study_labels).fillna(chart_df["studytime"].astype(str))
            order = [study_labels[x] for x in [1,2,3,4] if x in pd.to_numeric(filtered["studytime"], errors="coerce").unique()]
            fig = px.box(chart_df, x="Study time", y="G3", color="subject", points=False,
                         category_orders={"Study time":order}, color_discrete_map=palette)
            fig.update_layout(template="plotly_white", title="Study-time groups and grades",
                              paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No study-time column was found.")
    if "schoolsup" in filtered.columns:
        support = filtered.groupby(["schoolsup","subject"], as_index=False)["G3"].agg(["mean","count"]).reset_index()
        fig = px.bar(support, x="schoolsup", y="mean", color="subject", barmode="group",
                     color_discrete_map=palette, labels={"schoolsup":"Extra school support","mean":"Mean final grade"})
        fig.update_layout(template="plotly_white", title="School support groups",
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
    st.caption("Group differences are descriptive and may reflect other factors. They should not be interpreted as causal effects.")

with tab_relationships:
    numeric = filtered.select_dtypes(include=np.number).columns.tolist()
    if len(numeric) >= 2:
        corr = filtered[numeric].corr()
        fig = px.imshow(corr, text_auto=".2f", aspect="auto",
                        color_continuous_scale=["#C55A38","#F7F5EF","#17382B"],
                        zmin=-1, zmax=1, labels={"color":"Pearson r"})
        fig.update_layout(template="plotly_white", title="Correlation matrix",
                          paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)
        st.info("Correlation measures association between numeric variables. It does not prove that one variable causes another.")
        if "G3" in numeric:
            associations = corr["G3"].drop("G3").sort_values(key=lambda s: s.abs(), ascending=False).rename("Correlation with G3").to_frame()
            st.dataframe(associations.round(3), use_container_width=True)
    else:
        st.info("At least two numeric columns are needed for correlation analysis.")

with tab_explorer:
    st.markdown('<div class="section-title">Explore filtered records</div>', unsafe_allow_html=True)
    st.caption(f"Showing {len(filtered):,} records based on your sidebar selections.")
    preferred = [c for c in ["subject","school","sex","age","studytime","absences","failures","G1","G2","G3"] if c in filtered.columns]
    other_cols = [c for c in filtered.columns if c not in preferred]
    st.dataframe(filtered[preferred + other_cols], use_container_width=True, height=430)
    st.download_button("↓  Download filtered CSV", data=filtered.to_csv(index=False).encode("utf-8"),
                       file_name="student_performance_filtered.csv", mime="text/csv")
    quality = pd.DataFrame({
        "Column": filtered.columns,
        "Data type": [str(filtered[c].dtype) for c in filtered.columns],
        "Missing": [int(filtered[c].isna().sum()) for c in filtered.columns],
        "Unique values": [int(filtered[c].nunique(dropna=True)) for c in filtered.columns]
    })
    st.markdown('<div class="section-title">Data quality check</div>', unsafe_allow_html=True)
    st.dataframe(quality, use_container_width=True, hide_index=True)
    st.write(f"Duplicate rows in current filtered view: **{int(filtered.duplicated().sum())}**")

st.markdown("---")
st.markdown('<div class="small-muted">STUDENT PERFORMANCE INSIGHT STUDIO · Descriptive analysis only · Built with Streamlit and Plotly</div>', unsafe_allow_html=True)
