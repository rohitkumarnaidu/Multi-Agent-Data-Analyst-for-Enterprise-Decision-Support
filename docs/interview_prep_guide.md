# Data Cleaning: Presentation and Interview Prep Guide

This guide is designed to help you confidently present your data cleaning process to a judge or interviewer. It covers the tools you used, how to explain your workflow, and how to answer tricky questions they might throw at you.

---

## 1. The Tools You Used
If the judge asks, **"What tools did you use to clean this data and why?"**
*   **Your Answer:** "I used **Python** with the **Pandas** library within a **Jupyter Notebook** (or VS Code). I chose Pandas because it's the industry standard for handling large datasets (this one has 200,000 rows). It allows for fast, programmatic data manipulation and makes it very easy to document the step-by-step process for reproducibility."

### Step-by-Step on How You Did It (To show your process)
If they ask, **"Walk me through your exact process."**
1.  **Environment Setup:** "First, I set up my Python environment and imported the pandas library."
2.  **Data Profiling:** "I loaded the raw CSV file into a DataFrame and used functions like `df.isnull().sum()` and `df.shape` to profile the data. This immediately showed me the size of the dataset and exactly which columns had missing values."
3.  **Strategic Imputation:** "Instead of blindly deleting rows with missing data, I went column by column. For numerical metrics, I used statistical imputation. For categorical data, I used logical placeholders."
4.  **Formatting & Deduplication:** "Finally, I normalized the date columns into proper `datetime` objects and dropped any duplicate rows to ensure the integrity of the models that will use this data."

---

## 2. Explaining HOW You Found and Fixed the Issues

### "How did you find the missing data?"
**Your Answer:** "I used data profiling commands in Pandas. Specifically, running `df.isnull().sum()` calculates the exact number of null or empty cells in every single column. This highlighted that fields like `Agent_Accuracy_Feedback` had 144,000 missing values, while metrics like `Processing_Time_Sec` only had about 4,000 missing values."

### "How did you decide how to complete/fix these issues?"
**Your Answer:** "I made decisions based on the *context* of the data:
*   For the massive missing chunks in **Feedback and Handler IDs**, I recognized that these were 'Missing Not At Random'. The system didn't fail; it's just that an automated agent resolved the query without a human. So, I filled them with `0` and `Auto-Resolved` instead of deleting them.
*   For the **Numerical Metrics**, deleting 5,000 rows would mean losing valuable data. I imputed (filled) them using the median value of their respective columns to maintain statistical balance."

---

## 3. Potential Judge Questions & How to Answer Them

Here are the most common questions a judge will ask to test if you actually understand the cleaning process, along with the perfect answers.

### Question 1: "Why did you fill the missing numerical values with the *Median* instead of the *Mean* (Average)?"
**The Perfect Answer:** 
"I used the median because it is robust against outliers. In enterprise datasets, things like `Cost_Savings_Potential_USD` or `Processing_Time_Sec` can have extreme spikes (outliers). If I used the mean, a few massive outliers would pull the average way up, and I'd be filling the missing data with inaccurately high numbers. The median gives us the true 'middle' of the data, keeping the dataset balanced."

### Question 2: "Over 70% of the `Agent_Accuracy_Feedback` column was missing. Why didn't you just drop that column entirely?"
**The Perfect Answer:**
"Because the 'missingness' itself is valuable information! A missing feedback score tells us that the query was fully automated and didn't require human intervention. If I dropped the column, I would lose the ability to analyze the difference between AI-resolved queries and human-resolved queries. Filling it with `0` allows the machine learning model to recognize that distinction."

### Question 3: "Why did you convert the Date and Timestamp columns into `datetime` objects? They look exactly the same in the CSV."
**The Perfect Answer:**
"While they look the same to a human reading the CSV, to a computer, they initially load as plain text (strings). By explicitly converting them to Pandas `datetime` objects, I unlocked the ability to do time-series analysis. Now, we can easily extract the month, day of the week, or calculate the exact duration between different events, which is impossible if they remain as text."

### Question 4: "How do you guarantee that your cleaning process didn't corrupt the original data?"
**The Perfect Answer:**
"I maintained a strict non-destructive workflow. I never modified the original `raw/enterprise_multiagent_decision_support.csv` file. All transformations were done in memory using Pandas, and the final result was exported to a completely new file (`cleaned_enterprise...csv`). This means we always have the raw ground-truth data to fall back on if we need to audit the process."
