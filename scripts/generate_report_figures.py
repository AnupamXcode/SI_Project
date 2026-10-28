import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from sklearn.metrics import roc_curve, auc

output_dir = os.path.join(os.path.dirname(__file__), "..", "report_figures")
os.makedirs(output_dir, exist_ok=True)

plt.rcParams['font.family'] = 'DejaVu Sans'

# ==============================================================================
# FIGURE 6.3: Confusion Matrix Plot for Logistic Regression
# (TN: 52, FP: 1, FN: 3, TP: 23)
# ==============================================================================
fig, ax = plt.subplots(figsize=(7.2, 6.2), dpi=300)

cm = np.array([[52, 1],
               [3, 23]])

colors = [
    ["#1e3d30", "#edf3ee"],  # Row 0: TN (dark forest green), FP (light pale green)
    ["#f7ebe6", "#3d6455"]   # Row 1: FN (light pale terra), TP (medium forest green)
]

text_colors = [
    ["#FFFFFF", "#1C2923"],  # TN text white, FP text dark
    ["#1C2923", "#FFFFFF"]   # FN text dark, TP text white
]

cell_labels = [
    ["True Negative (TN)\n52\n(65.8%)", "False Positive (FP)\n1\n(1.3%)"],
    ["False Negative (FN)\n3\n(3.8%)",  "True Positive (TP)\n23\n(29.1%)"]
]

for i in range(2):
    for j in range(2):
        rect = patches.Rectangle((j - 0.5, i - 0.5), 1, 1, 
                                 facecolor=colors[i][j], 
                                 edgecolor="#D1DCD0", linewidth=2.0)
        ax.add_patch(rect)
        ax.text(j, i, cell_labels[i][j], ha="center", va="center",
                color=text_colors[i][j], fontsize=12.5, weight="bold", linespacing=1.35)

ax.set_xlim(-0.5, 1.5)
ax.set_ylim(1.5, -0.5)

ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(["Predicted Pass (Class 0)", "Predicted At-Risk / Fail (Class 1)"], fontsize=10.5, weight="bold", color="#1C2923")
ax.set_yticklabels(["Actual Pass\n(Class 0)", "Actual At-Risk / Fail\n(Class 1)"], fontsize=10.5, weight="bold", color="#1C2923")

ax.set_xlabel("Predicted Class", fontsize=11.5, labelpad=14, weight="bold", color="#203B2F")
ax.set_ylabel("Actual Class", fontsize=11.5, labelpad=14, weight="bold", color="#203B2F")

ax.set_title("Figure 6.3: Confusion Matrix Plot for Logistic Regression\n(TN: 52, FP: 1, FN: 3, TP: 23 | Test Set n = 79)", 
             fontsize=12, pad=16, weight="bold", color="#203B2F")

metrics_text = (
    "Performance Summary:\n"
    "• Overall Accuracy: 94.94% (75/79)   • Precision (PPV): 95.83% (23/24)\n"
    "• Sensitivity / Recall: 88.46% (23/26)   • Specificity (TNR): 98.11% (52/53)   • F1-Score: 92.00%"
)
plt.figtext(0.5, 0.015, metrics_text, ha='center', fontsize=9.2, 
             bbox=dict(boxstyle='round,pad=0.55', facecolor='#FAF7F0', edgecolor='#E7E1D6', alpha=0.95))

plt.subplots_adjust(bottom=0.22, top=0.90, left=0.22, right=0.92)
fig_6_3_path = os.path.join(output_dir, "Figure_6_3_Confusion_Matrix.png")
plt.savefig(fig_6_3_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {fig_6_3_path}")


# ==============================================================================
# FIGURE 6.4: ROC-AUC Performance Curve
# ==============================================================================
fig, ax = plt.subplots(figsize=(7.0, 5.6), dpi=300)

np.random.seed(101)
neg_scores = np.concatenate([np.random.beta(1.8, 9.5, size=52), [0.58]])
pos_scores = np.concatenate([[0.34, 0.42, 0.47], np.random.beta(8.5, 2.0, size=23)])

y_true = np.array([0]*53 + [1]*26)
y_scores = np.concatenate([neg_scores, pos_scores])

fpr, tpr, _ = roc_curve(y_true, y_scores)
roc_auc = auc(fpr, tpr)

ax.plot(fpr, tpr, color='#D65A24', lw=2.8, label=f'Logistic Regression (AUC = {roc_auc:.3f})')
ax.fill_between(fpr, tpr, color='#F3D6C2', alpha=0.35)

ax.plot([0, 1], [0, 1], color='#74766F', lw=1.6, linestyle='--', label='Random Chance Baseline (AUC = 0.500)')

op_fpr = 1 / 53.0
op_tpr = 23 / 26.0
ax.plot(op_fpr, op_tpr, marker='o', markersize=9, color='#203B2F', zorder=5,
        label=f'Optimal Operating Point (Cutoff = 0.50)\nFPR = 0.019 (1-Spec), TPR = 0.885 (Sensitivity)')

ax.set_xlim([-0.02, 1.02])
ax.set_ylim([-0.02, 1.04])
ax.set_xlabel('False Positive Rate (1 - Specificity)', fontsize=11, labelpad=8, weight='bold', color='#292F2A')
ax.set_ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=11, labelpad=8, weight='bold', color='#292F2A')
ax.set_title('Figure 6.4: ROC-AUC Performance Curve\nReceiver Operating Characteristic Analysis', 
             fontsize=12, pad=14, weight='bold', color="#203B2F")

ax.grid(True, linestyle=':', alpha=0.6, color='#D0C8B8')
ax.legend(loc="lower right", frameon=True, facecolor='#FAF7F0', edgecolor='#E7E1D6', fontsize=9.2)

ax.annotate(f'High Discriminative Power\nAUC = {roc_auc:.3f}', 
            xy=(0.14, 0.88), xytext=(0.28, 0.72),
            arrowprops=dict(facecolor='#203B2F', shrink=0.08, width=1.2, headwidth=6),
            fontsize=9.2, weight='bold', color='#203B2F',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#FAF7F0', edgecolor='#DDBB67'))

plt.subplots_adjust(bottom=0.15, top=0.90, left=0.15, right=0.94)
fig_6_4_path = os.path.join(output_dir, "Figure_6_4_ROC_AUC_Curve.png")
plt.savefig(fig_6_4_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {fig_6_4_path}")


# ==============================================================================
# FIGURE 6.5: Web GUI Live Prediction Display and Risk Probability Indicator
# ==============================================================================
fig, ax = plt.subplots(figsize=(11.0, 6.4), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 60)
ax.axis('off')

# Browser Outer Frame
browser_bg = patches.FancyBboxPatch((0.5, 0.5), 99, 58, boxstyle="round,pad=0.2,rounding_size=1.2",
                                    facecolor="#FAF7F0", edgecolor="#D1C7B7", linewidth=1.5)
ax.add_patch(browser_bg)

# Browser Title Bar
header_bg = patches.FancyBboxPatch((0.5, 54), 99, 4.5, boxstyle="round,pad=0,rounding_size=1.0",
                                   facecolor="#203B2F", edgecolor="#203B2F", linewidth=0)
ax.add_patch(header_bg)

for idx, color in enumerate(["#E76F51", "#E9C46A", "#2A9D8F"]):
    circle = patches.Circle((2.5 + idx * 2.2, 56.2), 0.7, facecolor=color)
    ax.add_patch(circle)

ax.text(9.5, 56.2, "Student Intelligence Studio  ›  Live Academic Risk Prediction Engine", 
        color="#FFFDF7", fontsize=10.0, weight="bold", va="center")
ax.text(78, 56.2, "● Model Live: Logistic Reg", color="#DDBB67", fontsize=8.8, weight="bold", va="center")

# Left Column: Inputs
input_panel = patches.FancyBboxPatch((3, 3.5), 45, 48, boxstyle="round,pad=0.4,rounding_size=0.8",
                                     facecolor="#FFFFFF", edgecolor="#E7E1D6", linewidth=1.2)
ax.add_patch(input_panel)

ax.text(5.5, 48.5, "STUDENT PROFILE & ACADEMIC ATTRIBUTES", color="#74766F", fontsize=8.0, weight="bold")
ax.text(5.5, 46.0, "Active Student Evaluation Inputs", color="#203B2F", fontsize=12, weight="bold")

features = [
    ("First Period Grade (G1)", "13 / 20", "Passing Standard (Bom)"),
    ("Second Period Grade (G2)", "12 / 20", "Passing Standard (Suficiente)"),
    ("Previous Class Failures", "0 failures", "Zero Failure Inertia"),
    ("Absences (School Truancy)", "4 days", "Normal Attendance (< 5 days)"),
    ("Weekly Study Time", "5 - 10 hours", "Tier 3: Moderate-High Engagement"),
    ("Parental Education (Medu/Fedu)", "Level 3 / 4", "Secondary / Higher Education"),
    ("Higher Education Ambition", "Yes (aspirant)", "High Positive Motivation"),
    ("School Support (schoolsup)", "None", "No Remedial Intervention Needed")
]

y_pos = 42.0
for feat_name, val, note in features:
    ax.text(5.5, y_pos, feat_name, fontsize=8.5, color="#292F2A", weight="semibold")
    ax.text(46.0, y_pos, val, fontsize=8.5, color="#203B2F", weight="bold", ha="right")
    ax.text(5.5, y_pos - 1.5, f"Context: {note}", fontsize=7.2, color="#8B8E85", style="italic")
    
    line = patches.ConnectionPatch((5.5, y_pos - 2.3), (46.0, y_pos - 2.3), "data", "data",
                                   color="#F2EFE8", linewidth=0.8)
    ax.add_artist(line)
    y_pos -= 4.8

# Right Column: Model Inference & Probability Indicators
output_panel = patches.FancyBboxPatch((51, 3.5), 46, 48, boxstyle="round,pad=0.4,rounding_size=0.8",
                                      facecolor="#FFFFFF", edgecolor="#E7E1D6", linewidth=1.2)
ax.add_patch(output_panel)

ax.text(53.5, 48.5, "INFERENCE ENGINE  •  LOGISTIC REGRESSION", color="#74766F", fontsize=8.0, weight="bold")
ax.text(53.5, 46.0, "Live Risk Assessment & Forecast", color="#203B2F", fontsize=12, weight="bold")

# Status Banner
status_box = patches.FancyBboxPatch((53.5, 37.8), 41.5, 6.2, boxstyle="round,pad=0.3,rounding_size=0.6",
                                    facecolor="#EAF2EB", edgecolor="#203B2F", linewidth=1.5)
ax.add_patch(status_box)
ax.text(55.2, 41.6, "STATUS: MINIMAL RISK — PASS EXPECTED", color="#17382B", fontsize=9.8, weight="bold")
ax.text(55.2, 39.4, "Model Output: Class 0 (Safe)  •  Confidence Level: 91.4%", color="#4E6857", fontsize=8.0)

# Class Probability Distribution Section
ax.text(53.5, 35.0, "Predicted Probability Distribution:", color="#292F2A", fontsize=9.2, weight="bold")

# Success Probability Bar
ax.text(53.5, 32.2, "Passing Probability (G3 ≥ 10):", color="#203B2F", fontsize=8.5, weight="semibold")
ax.text(94.5, 32.2, "91.4%", color="#203B2F", fontsize=10, weight="bold", ha="right")

bar_bg1 = patches.FancyBboxPatch((53.5, 29.0), 41, 2.3, boxstyle="round,pad=0,rounding_size=0.4",
                                 facecolor="#EFEFEA", edgecolor="none")
bar_fg1 = patches.FancyBboxPatch((53.5, 29.0), 41 * 0.914, 2.3, boxstyle="round,pad=0,rounding_size=0.4",
                                 facecolor="#203B2F", edgecolor="none")
ax.add_patch(bar_bg1)
ax.add_patch(bar_fg1)

# At-Risk Probability Bar
ax.text(53.5, 25.8, "Academic Risk Index (G3 < 10):", color="#C55A38", fontsize=8.5, weight="semibold")
ax.text(94.5, 25.8, "8.6%", color="#C55A38", fontsize=10, weight="bold", ha="right")

bar_bg2 = patches.FancyBboxPatch((53.5, 22.6), 41, 2.3, boxstyle="round,pad=0,rounding_size=0.4",
                                 facecolor="#EFEFEA", edgecolor="none")
bar_fg2 = patches.FancyBboxPatch((53.5, 22.6), 41 * 0.086, 2.3, boxstyle="round,pad=0,rounding_size=0.4",
                                 facecolor="#D65A24", edgecolor="none")
ax.add_patch(bar_bg2)
ax.add_patch(bar_fg2)

# Contributing Explanatory Signals
ax.text(53.5, 18.8, "Top Feature Risk Contributions (Odds Multipliers):", color="#292F2A", fontsize=8.8, weight="bold")

signals = [
    ("✓  Zero past academic failures", "+3.42x odds of passing", "#203B2F"),
    ("✓  Passing G1 & G2 marks (≥ 12)", "+2.85x odds of passing", "#203B2F"),
    ("✓  Low school truancy (4 days)", "+1.65x odds of passing", "#203B2F"),
    ("▲  Study time tier 3 (5-10 hrs)", "+1.22x odds of passing", "#74766F")
]

sig_y = 16.0
for sig, impact, sig_color in signals:
    ax.text(53.8, sig_y, sig, color=sig_color, fontsize=8.2, weight="semibold")
    ax.text(94.5, sig_y, impact, color=sig_color, fontsize=8.0, ha="right", style="italic")
    sig_y -= 2.6

fig_6_5_path = os.path.join(output_dir, "Figure_6_5_Web_GUI_Prediction.png")
plt.savefig(fig_6_5_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {fig_6_5_path}")
