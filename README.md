# Student Performance Insight Studio

A Streamlit dashboard for descriptive analysis of the UCI Student Performance dataset. It does not predict marks or pass/fail outcomes.

## Run locally

```bash
py -m pip install -r requirements.txt
py -m streamlit run app.py
```

If `py` is unavailable, use `python -m pip install -r requirements.txt` and `python -m streamlit run app.py`.

## Add data

Option A (recommended for a shared deployed link): create a `data` folder and place:
- `student-mat.csv`
- `student-por.csv`

The app detects the original semicolon-separated CSV format.

Option B: run the app without data files and upload either/both CSV files in the sidebar.

## Deploy and share

1. Push `app.py`, `requirements.txt`, and the `data/` folder to a GitHub repository.
2. Open https://share.streamlit.io/
3. Choose the repository, branch, and `app.py` as the main file.
4. Deploy. Streamlit Community Cloud will provide a shareable URL.

Only include data you are allowed to share publicly. If you do not want to publish the dataset in GitHub, use the sidebar upload approach; each viewer will need to upload the CSV themselves.

## Dataset source

UCI Machine Learning Repository — Student Performance:
https://archive.ics.uci.edu/dataset/320/student%2Bperformance
