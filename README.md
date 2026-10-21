# Smart Attendance Predictor 🎓🤖

An AI-powered attendance management and predictive forecasting platform designed and developed for **KGiSL Institute of Technology** (Autonomous), Department of Artificial Intelligence and Data Science, in collaboration with **Litz Tech**.

**Submitted by:** Gowdham S (Roll / Reg No: `711724UAD133`)  
**Department:** B.Tech Artificial Intelligence and Data Science (Class III Year "A", Semester V)  
**Academic Year:** 2026-2027  
**Mentors & Guides:**
- **Internship Coordinator:** Ms. Jasmine Saranya
- **Head of the Department (HOD):** Dr. Sathish R
- **Dean (Academic & Research):** Dr. Kannan
- **Principal:** Dr. Suresh Kumar S

---

## 📌 Project Overview
Manual attendance tracking is prone to delays and lacks predictive insight. The **Smart Attendance Predictor** solves this by:
1. Recording hour-wise attendance (Present, Absent, On-Duty).
2. Calculating real-time attendance percentages against Anna University's mandatory **75% minimum threshold**.
3. Employing a **Scikit-learn/Pandas predictive machine learning model** to forecast each student's end-of-semester attendance percentage.
4. Providing **Explainable AI metrics**:
   - Exact number of consecutive classes a student **must attend** to cross 75%.
   - Safe bunk/absence allowance buffer for safe students.
   - Day-of-the-week pattern vulnerability detection (e.g. Monday morning/Friday lab absences).
   - Streak penalty modeling.
5. Interactive **"What-If" Scenario Simulator** allowing faculty and students to simulate future attendance outcomes.
6. Generating **official downloadable CSV spreadsheets** and **printable academic examination dossiers**.

---

## 🚀 Key Modules (As per Internship Report)

| Module | Features |
|---|---|
| **Task 1: Authentication** | User registration/login, JWT session security, demo role switcher (Faculty, Admin, Student). |
| **Task 2: Dashboard** | KPI stat cards, subject-wise attendance analytics, monthly progression charts, and recent activity feed. |
| **Task 3: Student Management** | Full CRUD student directory, search & filter by status (Safe, Warning, At-Risk), individual student profile drilldown. |
| **Task 4: Attendance Marking** | Period-wise marking sheet, Present (P) / Absent (A) / On-Duty (OD) toggles, bulk actions, and live recalculation. |
| **Task 5: AI Attendance Predictor** | Machine learning forecast engine, risk classification, consecutive classes recovery math, and What-If simulator. |
| **Task 6: Alerts & Notifications** | Low-attendance alerts, critical shortage warnings (&lt;65%), and copyable formal parent notice generator. |
| **Task 7: Reports & Analytics** | Semester attendance progression, CSV export, and printable official institutional report card with signature blocks. |
| **Task 8: Dossier & Viva Presentation** | In-app summer internship report viewer containing Bonafide Certificate, Objectives, and acknowledgments. |

---

## 🛠️ Technologies Used

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons & Animations:** Lucide React, Motion
- **Data Persistence:** LocalStorage & In-Memory Store
- **Predictive Analytics:** Feature-engineered linear regression & heuristic weighting model

---

## 💻 How to Run Locally

```bash
# 1. Clone repository
git clone <your-repo-url>
cd <repo-folder>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App will run locally on `http://localhost:3000`.

---

## 📤 Pushing to Your GitHub Account

To link and push this codebase to your own GitHub repository:

```bash
# 1. Create a new repository on https://github.com/new (e.g. named "smart-attendance-predictor")

# 2. Add your GitHub repository as remote:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/smart-attendance-predictor.git

# 3. Rename branch to main:
git branch -M main

# 4. Push code to GitHub:
git push -u origin main
```
