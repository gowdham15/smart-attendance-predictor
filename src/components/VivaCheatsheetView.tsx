import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Calculator,
  Play,
  Lightbulb,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface FAQ {
  q: string;
  category: 'core' | 'ml' | 'tech' | 'viva';
  shortAnswer: string;
  detailedAnswer: string;
  tamilTip: string;
}

const FAQS: FAQ[] = [
  {
    q: '1. What is the objective of the Smart Attendance Predictor?',
    category: 'core',
    shortAnswer:
      'To eliminate manual attendance tracking delays and provide proactive AI predictive forecasting to prevent student debarment before Anna University semester exams.',
    detailedAnswer:
      'Conventional systems only record historical attendance. Smart Attendance Predictor uses historical patterns, absence streaks, and day-of-week sensitivity to forecast end-of-semester attendance and computes the exact consecutive classes needed to cross the mandatory 75% threshold.',
    tamilTip: 'வழக்கமான attendance சிஸ்டம் யார் வந்தார்கள் என்று மட்டுமே சொல்லும்; நம் சிஸ்டம் செமஸ்டர் முடிவில் யார் 75% குறைவாக வந்து exam எழுத முடியாமல் போவார்கள் என்பதை முன்கூட்டியே AI மூலம் கணிக்கும்.',
  },
  {
    q: '2. How does the Prediction Engine calculate "Classes Needed for 75%"?',
    category: 'ml',
    shortAnswer:
      'Using the threshold formula: x = ceil((0.75 * totalClasses - attended) / 0.25).',
    detailedAnswer:
      'To reach target T = 0.75: (attended + x) / (total + x) >= 0.75. Solving for x yields x >= (0.75 * total - attended) / (1 - 0.75). If x exceeds remaining semester classes, the student is flagged as Critical Debarment Risk.',
    tamilTip: 'Formula: (Attended + x) / (Total + x) >= 0.75. இதை simplify செய்தால் x = (0.75 * Total - Attended) / 0.25. இதுதான் அவர்கள் தொடர்ந்து வர வேண்டிய வகுப்புகளின் எண்ணிக்கை.',
  },
  {
    q: '3. How is the "Safe Bunk / Absence Allowance" calculated?',
    category: 'ml',
    shortAnswer:
      'Using the formula: y = floor((attended - 0.75 * totalClasses) / 0.75).',
    detailedAnswer:
      'For safe students (>= 75%), this computes how many future consecutive lectures the student can safely miss without their overall percentage falling below the mandatory 75% threshold.',
    tamilTip: '75%-க்கு மேல் உள்ள மாணவர்களுக்கு, 75%-க்கு கீழ் இறங்காமல் எத்தனை கிளாஸ் லீவு எடுக்க முடியும் என்பதை கணக்கிடும் buffer இது.',
  },
  {
    q: '4. What features does your AI/ML model consider?',
    category: 'ml',
    shortAnswer:
      'Current attendance rate, consecutive absence streaks, day-of-week absenteeism patterns (e.g., Friday/Monday dips), and remaining semester lecture volume.',
    detailedAnswer:
      'Feature engineering incorporates a streak penalty factor (students with 3+ consecutive absences have lower projected attendance) and day-of-week vulnerability weighting where students historically miss more lab or first-period hours.',
    tamilTip: 'Features: 1. Current attendance %, 2. Absence streak (தொடர் விடுப்பு), 3. Day of week pattern (திங்கள்/வெள்ளி ஆப்சன்ட்), 4. Remaining classes count.',
  },
  {
    q: '5. Why React with Tailwind CSS on the frontend?',
    category: 'tech',
    shortAnswer:
      'Component-based reusable architecture, instantaneous virtual DOM updates for real-time recalculation, and zero-runtime CSS utility styling.',
    detailedAnswer:
      'React state management allows instant recalculation of class percentages the moment faculty clicks Present/Absent/OD, without requiring full page reloads. Tailwind CSS ensures a responsive layout accessible on faculty tablets and mobile phones.',
    tamilTip: 'React component architecture மற்றும் fast state update மூலம் teacher attendance மார்க் செய்த உடனே fraction of a second-ல் percentage அப்டேட் ஆகிறது.',
  },
  {
    q: '6. How does your system handle On-Duty (OD) permissions?',
    category: 'core',
    shortAnswer:
      'OD is treated as academic authorized presence, awarding favorable attendance credit while preserving separation in attendance logs.',
    detailedAnswer:
      'Students representing KGiSL in symposiums, hackathons, sports, or paper presentations are marked OD with specific remarks. OD entries grant 100% lecture credit in overall calculation without skewing pure physical classroom attendance metrics.',
    tamilTip: 'Symposium, hackathon போனால் OD மார்க் செய்யலாம்; அது மாணவரின் percentage-ஐ குறைக்காது.',
  },
  {
    q: '7. What did you learn during your internship at Litz Tech?',
    category: 'viva',
    shortAnswer:
      'Full-stack architecture, REST API design, database modeling, feature engineering for prediction models, and building production-grade dashboards.',
    detailedAnswer:
      'Under the guidance of Ms. Jasmine Saranya and Dr. Sathish R, I developed the complete workflow: from student database design to predictive modeling and institutional PDF/CSV report generation.',
    tamilTip: 'Litz Tech-ல் full-stack development, database CRUD, prediction algorithms, மற்றும் real-time reporting-ஐ practical-ஆக கற்றுக் கொண்டேன்.',
  },
  {
    q: '8. What are the Future Enhancements of this project?',
    category: 'viva',
    shortAnswer:
      'Automated WhatsApp/SMS gateway integration, biometric/facial recognition attendance capture, and a Flutter mobile app for students.',
    detailedAnswer:
      'Integrating with campus RFID or facial recognition cameras, real-time push notifications on mobile devices, and automated ERP timetable sync across academic semesters.',
    tamilTip: 'Mobile Flutter app, biometric facial recognition integration, மற்றும் automated WhatsApp alerts.',
  },
];

export const VivaCheatsheetView: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFaqs = FAQS.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Viva Ready Mode */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Viva-Voce &amp; Academic Evaluation Command Deck</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Internship Project Viva Presentation Kit
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Candidate: <strong className="text-white">GOWDHAM S (711724UAD133)</strong> &bull; III Year AI &amp; DS &lsquo;A&rsquo; &bull; KGiSL Institute of Technology &bull; Litz Tech Internship
          </p>
        </div>
      </div>

      {/* 1-Minute Elevator Pitch Box */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
        <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Your 60-Second Viva Opening Speech (Examiner முன்னிலையில் பேச வேண்டியது)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium space-y-2">
          <p>
            &ldquo;Respected Examiners and Faculty members, Good morning. I am <strong>Gowdham S</strong>, Roll Number <strong>711724UAD133</strong>, from 3rd Year Artificial Intelligence and Data Science. As part of my Summer Internship at <strong>Litz Tech</strong>, I designed and developed the <strong>Smart Attendance Predictor</strong>.&rdquo;
          </p>
          <p>
            &ldquo;Conventional systems only record attendance after classes end. Our system uses a <strong>predictive machine learning model</strong> that analyzes attendance trends, consecutive absence streaks, and weekday patterns to predict whether a student will meet Anna University&rsquo;s mandatory <strong>75% threshold</strong> before semester examinations. It gives actionable recovery plans like the exact consecutive classes needed, offers an interactive What-If simulator, and automates parent intimation notices.&rdquo;
          </p>
        </div>
        <div className="mt-3 text-xs text-amber-800 font-semibold flex items-center space-x-1.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Tamil Summary Tip: &ldquo;இந்த 1 நிமிட அறிமுகத்தை தெளிவாக பேசினால் Examiner முழு project flow-வையும் எளிதில் புரிந்து கொள்வார்!&rdquo;</span>
        </div>
      </div>

      {/* 3-Step Live Demo Flow (எப்படி demo காட்ட வேண்டும்) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Play className="w-4 h-4 text-blue-600" />
          <span>3-Step Live Project Demonstration Flow (Demo காட்டும் வரிசை)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-900">Mark Attendance Live</h4>
            <p className="text-slate-600">
              Click <strong>Mark Attendance</strong> ➔ Select Period 3 (Deep Learning) ➔ Mark students Present, Absent, or On-Duty ➔ Click Submit. Show how percentage recalibrates instantly.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-900">Show AI Predictor &amp; What-If</h4>
            <p className="text-slate-600">
              Switch to <strong>AI Attendance Predictor</strong> ➔ Explain the <em>Classes Needed for 75%</em> metric ➔ Move the <strong>What-If Simulator slider</strong> to show future percentage outcomes.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-900">Export Reports &amp; Notices</h4>
            <p className="text-slate-600">
              Go to <strong>Reports &amp; Analytics</strong> ➔ Click <strong>Download CSV</strong> ➔ Switch to Printable Dossier with KGiSL college header and HOD/Principal signature lines.
            </p>
          </div>
        </div>
      </div>

      {/* Top 8 Viva Questions & Winning Answers */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Top Examiner Viva Questions &amp; Best Answers (கேள்வி - பதில்கள்)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Examiner கேட்கக்கூடிய முக்கிய 8 கேள்விகளுக்கான துல்லியமான பதில்கள்
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 text-xs">
            {['all', 'core', 'ml', 'tech', 'viva'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-100 text-xs space-y-2.5">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Quick Answer (சுருக்கமான பதில்):
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {faq.shortAnswer}
                      </p>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Detailed Technical Explanation:
                      </div>
                      <p className="text-slate-600 leading-relaxed mt-0.5">
                        {faq.detailedAnswer}
                      </p>
                    </div>

                    <div className="bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-start space-x-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Tamil Explanation Tip:</strong> {faq.tamilTip}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* College & Internship Attribution Box */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold text-slate-800">
            KGiSL Institute of Technology (Autonomous)
          </span>{' '}
          &bull; Dept of Artificial Intelligence &amp; Data Science &bull; Summer Internship Report (July 2026)
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Student: Gowdham S (711724UAD133)
        </div>
      </div>

    </div>
  );
};
